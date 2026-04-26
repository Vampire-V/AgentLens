import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import { compressedYamlParser } from '../compressed-yaml-parser';

const SAMPLE_YAML = `version: "1.0.0"
name: "Test Pipeline"
agents:
  - id: agent_a
    name: "Agent A"
    role: manager
    model: claude-opus-4-7
  - id: agent_b
    name: "Agent B"
    role: worker
    model: claude-sonnet-4-6
routes:
  - id: r1
    source: agent_a
    target: agent_b
    label: "task"
`;

describe('compressedYamlParser', () => {
  it('roundtrip__serialize_then_parse__returns_original_yaml', () => {
    const serialized = compressedYamlParser.serialize(SAMPLE_YAML);
    const parsed = compressedYamlParser.parse(serialized);
    expect(parsed).toBe(SAMPLE_YAML);
  });

  it('backward_compat__parse_raw_uncompressed_string__returns_string_without_crash', () => {
    const rawValue = 'version: "1.0.0"\nname: "Simple"';
    const parsed = compressedYamlParser.parse(rawValue);
    expect(parsed).toBe(rawValue);
  });

  it('size_reduction__serialize_long_yaml__compressed_is_shorter', () => {
    const serialized = compressedYamlParser.serialize(SAMPLE_YAML);
    expect(serialized.length).toBeLessThan(SAMPLE_YAML.length);
  });

  it('serialize__produces_valid_lz_encoded_uri_component__decompresses_correctly', () => {
    const serialized = compressedYamlParser.serialize(SAMPLE_YAML);
    const decompressed = LZString.decompressFromEncodedURIComponent(serialized);
    expect(decompressed).toBe(SAMPLE_YAML);
  });
});
