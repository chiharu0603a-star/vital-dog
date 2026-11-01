const DEFAULT_MAX_BYTES = 200 * 1024;
const MAX_SHORT_SIDE = 1280;
const OUTPUT_FORMAT = 'image/jpeg';

// data URL（base64）のデコード後のバイト数
export function dataUrlDecodedBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - padding);
}

// localStorage に保存したときの占有バイト数（UTF-16換算）
export function dataUrlStorageBytes(dataUrl: string): number {
  return dataUrl.length * 2;
}

export type EncodeAttempt = { scale: number; quality: number };

// 縮小と画質の候補列（大きい順）。容量に収まる組み合わせを探すために使う
export function shrinkLadder(): EncodeAttempt[] {
  const steps: EncodeAttempt[] = [];
  for (const scale of [1, 0.85, 0.7, 0.55, 0.45, 0.35, 0.28, 0.2]) {
    for (const quality of [0.8, 0.65, 0.5, 0.35, 0.25]) {
      steps.push({ scale, quality });
    }
  }
  return steps;
}

// 予算（data URLの文字数）に収まる最初のエンコード結果を返す。
// どれも収まらない場合は、試した中で一番小さい結果を返す。
export function pickEncoding(encode: (attempt: EncodeAttempt) => string, maxChars: number): string {
  let smallest: string | null = null;
  for (const attempt of shrinkLadder()) {
    const out = encode(attempt);
    if (smallest === null || out.length < smallest.length) smallest = out;
    if (out.length <= maxChars) return out;
  }
  return smallest ?? '';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function encodeImage(img: HTMLImageElement, maxChars: number): string {
  let { width, height } = img;
  const shortSide = Math.min(width, height);
  if (shortSide > MAX_SHORT_SIDE) {
    const ratio = MAX_SHORT_SIDE / shortSide;
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const encode = ({ scale, quality }: EncodeAttempt): string => {
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL(OUTPUT_FORMAT, quality);
  };
  return pickEncoding(encode, maxChars);
}

// 写真ファイルを指定サイズ（デコード後のバイト数）に収まるよう圧縮する。
// 画質を下げるだけでは足りない場合は、画像自体も段階的に縮小する。
export async function compressImage(file: File, maxBytes: number = DEFAULT_MAX_BYTES): Promise<string> {
  const src = await fileToDataUrl(file);
  const img = await loadImage(src);
  const maxChars = Math.ceil(maxBytes / 3) * 4 + 64;
  return encodeImage(img, maxChars);
}

// すでに data URL になっている画像を、保存容量（localStorage占有バイト数）に
// 収まるよう縮小し直す。容量不足で保存に失敗したときの自動リカバリ用。
export async function compressDataUrl(dataUrl: string, maxStorageBytes: number): Promise<string> {
  const img = await loadImage(dataUrl);
  const maxChars = Math.max(1024, Math.floor(maxStorageBytes / 2));
  return encodeImage(img, maxChars);
}
