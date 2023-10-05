
// Should make typescript able to handle bitfontloader fonts, got this from chatGPT
declare module 'phaser' {
    namespace Loader.FileTypes {
        interface BitmapFontFileConfig {
            font?: string;
        }
    }
}