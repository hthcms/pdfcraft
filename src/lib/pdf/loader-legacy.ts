/**
 * PDF.js legacy-build loader.
 *
 * Loads the patched pdfjs-dist 4.10 legacy build (same package line as the
 * main viewer). pdfjs-dist 2.16 shipped SVGGraphics, and it is also the
 * release affected by GHSA-wgrm-67xf-hhpq. That module was removed before
 * the patch, so vector tools fall back when SVGGraphics is unavailable.
 */

// Type definitions for legacy pdfjs-dist
type PDFJSLegacyModule = typeof import('pdfjs-dist-legacy');

// Cached library instance
let pdfjsLegacyInstance: PDFJSLegacyModule | null = null;

// Loading promise to prevent duplicate loads
let pdfjsLegacyLoadingPromise: Promise<PDFJSLegacyModule> | null = null;

// Worker configuration flag
let legacyWorkerConfigured = false;

/**
 * Configure legacy PDF.js worker source
 * Uses the worker bundled locally for offline support
 */
function configureLegacyWorker(pdfjsLib: PDFJSLegacyModule): void {
    if (legacyWorkerConfigured) return;

    if (typeof window !== 'undefined') {
        // Same patched worker the main loader uses. The legacy build worker is
        // also copied to /workers/pdf.worker.legacy.min.mjs by postinstall.
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/workers/pdf.worker.min.js';
        legacyWorkerConfigured = true;
    }
}

/**
 * Load the patched pdfjs-dist build used for SVG conversion attempts.
 */
export async function loadPdfjsLegacy(): Promise<PDFJSLegacyModule> {
    if (pdfjsLegacyInstance) {
        return pdfjsLegacyInstance;
    }

    if (pdfjsLegacyLoadingPromise) {
        return pdfjsLegacyLoadingPromise;
    }

    pdfjsLegacyLoadingPromise = import('pdfjs-dist-legacy').then((module) => {
        // Configure worker
        configureLegacyWorker(module);
        pdfjsLegacyInstance = module;
        pdfjsLegacyLoadingPromise = null;
        return module;
    });

    return pdfjsLegacyLoadingPromise;
}

/**
 * SVGGraphics type definition
 */
export interface SVGGraphicsInstance {
    embedFonts: boolean;
    getSVG(operatorList: any, viewport: any): Promise<SVGElement>;
}

export interface SVGGraphicsConstructor {
    new(commonObjs: any, objs: any): SVGGraphicsInstance;
}

/**
 * SVGGraphics lived in pdfjs-dist 2.x and is not part of the patched 4.10
 * package. Callers fall back to canvas rendering.
 */
export async function loadSVGGraphics(): Promise<SVGGraphicsConstructor> {
    throw new Error(
        'SVGGraphics is not part of patched pdfjs-dist 4.10.38 (removed before GHSA-wgrm-67xf-hhpq was fixed).'
    );
}

/**
 * Check if legacy library is loaded
 */
export function isLegacyLibraryLoaded(): boolean {
    return pdfjsLegacyInstance !== null;
}

/**
 * Get legacy library loading status
 */
export function getLegacyLibraryStatus(): 'loaded' | 'loading' | 'not-loaded' {
    return pdfjsLegacyInstance
        ? 'loaded'
        : pdfjsLegacyLoadingPromise
            ? 'loading'
            : 'not-loaded';
}
