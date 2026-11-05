/**
 * Type declarations for the pdfjs-dist-legacy alias (patched pdfjs-dist 4.10).
 * This is an alias for pdfjs-dist@2.16.105
 */

declare module 'pdfjs-dist-legacy' {
    export * from 'pdfjs-dist';
}

declare module 'pdfjs-dist-legacy/lib/display/svg' {
    export class SVGGraphics {
        constructor(commonObjs: any, objs: any);
        embedFonts: boolean;
        getSVG(operatorList: any, viewport: any): Promise<SVGElement>;
    }
}
