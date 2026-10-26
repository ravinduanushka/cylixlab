import { useEffect, useRef, useState, memo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// Individual page component that manages its own render lifecycle safely
const PdfPageCard = memo(({ pdfDoc, pageNum, isSmall }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!pdfDoc) return;
    let isCancelled = false;
    let renderTask = null;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const baseViewport = page.getViewport({ scale: isSmall ? 0.9 : 1.35 });

        canvas.width = Math.floor(baseViewport.width * dpr);
        canvas.height = Math.floor(baseViewport.height * dpr);
        canvas.style.width = `${Math.floor(baseViewport.width)}px`;
        canvas.style.height = `${Math.floor(baseViewport.height)}px`;

        const renderContext = {
          canvasContext: context,
          viewport: baseViewport,
          transform: dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`Error rendering page ${pageNum}:`, err);
        }
      }
    };

    render();

    return () => {
      isCancelled = true;
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNum, isSmall]);

  return (
    <div
      id={`pdf-page-wrapper-${pageNum}`}
      data-page-num={pageNum}
      className="pdf-single-page-card"
      style={{ minHeight: isSmall ? '480px' : '700px' }}
    >
      <canvas ref={canvasRef} className="pdf-page-canvas" />
    </div>
  );
});

PdfPageCard.displayName = 'PdfPageCard';

const PdfCanvasViewer = ({
  url,
  zoomLevel = 100,
  onPageChange,
  onTotalPages,
  targetPage,
  isSmall = false,
}) => {
  const containerRef = useRef(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDoc, setPdfDoc] = useState(null);

  // 1. Load PDF Document with intelligent fallback & local priority
  useEffect(() => {
    if (!url) return;
    let isCancelled = false;
    let activeTask = null;

    setLoading(true);
    setError(null);

    const isLocalhost =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Extract filename like learning_path_04.pdf or assignment_04.pdf
    const match = url.match(/(learning_path_\d+|assignment_\d+)\.pdf/i);
    const localUrl = match ? `/uploads/${match[0]}` : null;

    // Prioritize local file when running locally on computer to prevent slow network / CORS delay
    const urlsToTry = [];
    if (isLocalhost && localUrl) {
      urlsToTry.push(localUrl);
      if (url !== localUrl) urlsToTry.push(url);
    } else {
      urlsToTry.push(url);
      if (localUrl && url !== localUrl) urlsToTry.push(localUrl);
    }

    const tryLoadUrls = async (index = 0) => {
      if (index >= urlsToTry.length) {
        if (!isCancelled) {
          setError('Failed to load PDF document');
          setLoading(false);
        }
        return;
      }

      const currentUrl = urlsToTry[index].split('#')[0];
      try {
        const loadingTask = pdfjsLib.getDocument({
          url: currentUrl,
          cMapPacked: true,
          enableXfa: false,
        });
        activeTask = loadingTask;

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        if (onTotalPages) onTotalPages(doc.numPages);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        console.warn(`Failed loading PDF from ${currentUrl}, attempting fallback:`, err?.message || err);
        tryLoadUrls(index + 1);
      }
    };

    tryLoadUrls(0);

    return () => {
      isCancelled = true;
      if (activeTask) {
        try {
          activeTask.destroy();
        } catch {}
      }
    };
  }, [url]);

  // 2. Scroll to target page when navigation arrows (◀ / ▶) are clicked
  useEffect(() => {
    if (!targetPage || targetPage < 1 || targetPage > numPages) return;
    const pageEl = document.getElementById(`pdf-page-wrapper-${targetPage}`);
    if (pageEl && containerRef.current) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetPage, numPages]);

  // 3. Track visible page while scrolling down with IntersectionObserver
  useEffect(() => {
    if (!containerRef.current || numPages === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.getAttribute('data-page-num'), 10);
            if (pageNum && onPageChange) {
              onPageChange(pageNum);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.4,
      }
    );

    for (let p = 1; p <= numPages; p++) {
      const el = document.getElementById(`pdf-page-wrapper-${p}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [numPages, onPageChange]);

  const scale = zoomLevel / 100;

  if (loading) {
    return (
      <div className="pdf-canvas-loading">
        <div className="pdf-loading-spinner" />
        <span>Loading PDF document...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-canvas-error" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span>{error}</span>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setLoading(true);
            setPdfDoc(null);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`pdf-canvas-scroll-container ${isSmall ? 'small-mode' : 'fullscreen-mode'}`}
    >
      <div
        className="pdf-canvas-zoom-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
          <PdfPageCard
            key={`page-${pageNum}`}
            pdfDoc={pdfDoc}
            pageNum={pageNum}
            isSmall={isSmall}
          />
        ))}
      </div>
    </div>
  );
};

export default PdfCanvasViewer;
