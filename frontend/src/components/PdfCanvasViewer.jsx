import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

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
  const canvasRefs = useRef({});

  // 1. Load PDF Document
  useEffect(() => {
    if (!url) return;
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const cleanUrl = url.split('#')[0];

    const loadingTask = pdfjsLib.getDocument(cleanUrl);
    loadingTask.promise
      .then((doc) => {
        if (isCancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        if (onTotalPages) onTotalPages(doc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error loading PDF with PDF.js:', err);
        setError('Failed to load PDF');
        setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // 2. Render each page onto its canvas
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;
    let isCancelled = false;

    const renderPages = async () => {
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        if (isCancelled) break;
        try {
          const page = await pdfDoc.getPage(pageNum);
          const canvas = canvasRefs.current[pageNum];
          if (!canvas) continue;

          const context = canvas.getContext('2d');
          const dpr = window.devicePixelRatio || 1;
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

          await page.render(renderContext).promise;
        } catch (renderErr) {
          console.warn(`Error rendering page ${pageNum}:`, renderErr);
        }
      }
    };

    renderPages();

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, numPages, isSmall]);

  // 3. Scroll to target page when navigation arrows (◀ / ▶) are clicked
  useEffect(() => {
    if (!targetPage || targetPage < 1 || targetPage > numPages) return;
    const pageEl = document.getElementById(`pdf-page-wrapper-${targetPage}`);
    if (pageEl && containerRef.current) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [targetPage, numPages]);

  // 4. Track visible page while scrolling down with IntersectionObserver
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
        threshold: 0.5,
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
      <div className="pdf-canvas-error">
        <span>{error}</span>
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
          <div
            key={`page-${pageNum}`}
            id={`pdf-page-wrapper-${pageNum}`}
            data-page-num={pageNum}
            className="pdf-single-page-card"
          >
            <canvas
              ref={(el) => {
                if (el) canvasRefs.current[pageNum] = el;
              }}
              className="pdf-page-canvas"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfCanvasViewer;
