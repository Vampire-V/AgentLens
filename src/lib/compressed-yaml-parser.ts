import { createParser } from 'nuqs';
import LZString from 'lz-string';

export const compressedYamlParser = createParser({
  parse(value: string) {
    const decompressed = LZString.decompressFromEncodedURIComponent(value);
    // decompressFromEncodedURIComponent คืน null เมื่อ input ไม่ใช่ lz-string (URL เก่า)
    return decompressed ?? value;
  },
  serialize(value: string) {
    return LZString.compressToEncodedURIComponent(value);
  },
});
