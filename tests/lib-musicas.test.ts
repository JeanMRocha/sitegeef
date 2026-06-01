import { describe, it, expect } from 'vitest';
import {
  isTituloSameasTipo,
  slugifyMusica,
  generatePairingCode,
  getStatusLabel,
  parsePartesFromText,
  type MusicaParte,
} from '@/lib/musicas';

describe('lib/musicas', () => {
  describe('isTituloSameasTipo', () => {
    it('matches exact title and tipo', () => {
      expect(isTituloSameasTipo('Verso', 'verso')).toBe(true);
      expect(isTituloSameasTipo('Verso', 'Verso')).toBe(true);
    });

    it('ignores accents and diacritics', () => {
      expect(isTituloSameasTipo('Coro', 'côro')).toBe(true);
      expect(isTituloSameasTipo('Café', 'cafe')).toBe(true);
    });

    it('ignores whitespace', () => {
      expect(isTituloSameasTipo('  Verso  ', 'verso')).toBe(true);
    });

    it('returns false for different titles', () => {
      expect(isTituloSameasTipo('Verso', 'Refrão')).toBe(false);
      expect(isTituloSameasTipo('Estrofe', 'Verso')).toBe(false);
    });

    it('handles case insensitivity', () => {
      expect(isTituloSameasTipo('VERSO', 'verso')).toBe(true);
    });
  });

  describe('slugifyMusica', () => {
    it('converts title to lowercase kebab-case', () => {
      expect(slugifyMusica('Amazing Grace')).toBe('amazing-grace');
    });

    it('removes accents', () => {
      expect(slugifyMusica('Música Espírita')).toBe('musica-espirita');
    });

    it('removes special characters', () => {
      expect(slugifyMusica('Song (Version 2)')).toBe('song-version-2');
    });

    it('limits slug length to 60 characters', () => {
      const longTitle = 'A'.repeat(100);
      expect(slugifyMusica(longTitle).length).toBeLessThanOrEqual(60);
    });

    it('defaults to "musica" for empty input', () => {
      expect(slugifyMusica('')).toBe('musica');
    });

    it('appends suffix when provided', () => {
      expect(slugifyMusica('My Song', 'v2')).toBe('my-song-v2');
    });

    it('handles multiple spaces', () => {
      expect(slugifyMusica('Song   With   Spaces')).toBe('song-with-spaces');
    });

    it('removes leading/trailing dashes', () => {
      expect(slugifyMusica('---Song---')).toBe('song');
    });
  });

  describe('generatePairingCode', () => {
    it('generates a 6-character code', () => {
      const code = generatePairingCode();
      expect(code.length).toBe(6);
    });

    it('uses only valid alphabet characters', () => {
      const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (let i = 0; i < 10; i++) {
        const code = generatePairingCode();
        for (const char of code) {
          expect(validChars).toContain(char);
        }
      }
    });

    it('generates different codes on each call', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generatePairingCode());
      }
      expect(codes.size).toBeGreaterThan(90);
    });

    it('does not use ambiguous characters', () => {
      const forbiddenChars = /[IOl0]/;
      for (let i = 0; i < 10; i++) {
        const code = generatePairingCode();
        expect(forbiddenChars.test(code)).toBe(false);
      }
    });
  });

  describe('getStatusLabel', () => {
    it('returns Portuguese label for ativa', () => {
      expect(getStatusLabel('ativa')).toBe('Ativa');
    });

    it('returns Portuguese label for rascunho', () => {
      expect(getStatusLabel('rascunho')).toBe('Rascunho');
    });

    it('returns Portuguese label for inativa', () => {
      expect(getStatusLabel('inativa')).toBe('Inativa');
    });

    it('returns "Desconhecido" for unknown status', () => {
      expect(getStatusLabel('unknown')).toBe('Desconhecido');
      expect(getStatusLabel('')).toBe('Desconhecido');
      expect(getStatusLabel('invalid')).toBe('Desconhecido');
    });

    it('is case-sensitive', () => {
      expect(getStatusLabel('ATIVA')).toBe('Desconhecido');
      expect(getStatusLabel('Ativa')).toBe('Desconhecido');
    });
  });

  describe('parsePartesFromText', () => {
    it('returns empty array for empty input', () => {
      expect(parsePartesFromText('')).toEqual([]);
      expect(parsePartesFromText(null as any)).toEqual([]);
      expect(parsePartesFromText(undefined as any)).toEqual([]);
    });

    it('extracts single section from text', () => {
      const text = `
=== VERSO ===
Verso da música aqui
      `;
      const partes = parsePartesFromText(text);
      expect(partes.length).toBeGreaterThan(0);
      expect(partes[0].tipo).toBe('verso');
      expect(partes[0].conteudo).toContain('Verso da música');
    });

    it('extracts multiple sections', () => {
      const text = `
=== VERSO ===
Primeiro verso

=== REFRÃO ===
Refrão da música

=== VERSO ===
Segundo verso
      `;
      const partes = parsePartesFromText(text);
      expect(partes.length).toBeGreaterThanOrEqual(2);
    });

    it('preserves content within sections', () => {
      const text = `
=== VERSO ===
Meu texto com
múltiplas linhas
e espaços
      `;
      const partes = parsePartesFromText(text);
      expect(partes[0].conteudo).toContain('múltiplas linhas');
    });

    it('ignores empty sections', () => {
      const text = `
=== VERSO ===

=== REFRÃO ===
Refrão

=== PONTE ===
      `;
      const partes = parsePartesFromText(text);
      expect(partes.length).toBeGreaterThan(0);
      expect(partes.some(p => p.conteudo.trim() === '')).toBe(false);
    });

    it('handles sections with no content', () => {
      const text = `
=== VERSO ===
Verso 1

=== REFRÃO ===
      `;
      const partes = parsePartesFromText(text);
      const verso = partes.find(p => p.tipo === 'verso');
      expect(verso).toBeDefined();
    });

    it('preserves ordem based on appearance', () => {
      const text = `
=== VERSO ===
V1

=== REFRÃO ===
R1

=== PONTE ===
P1
      `;
      const partes = parsePartesFromText(text);
      const tipos = partes.map(p => p.tipo);
      expect(tipos.indexOf('verso')).toBeLessThan(tipos.indexOf('refrao'));
    });

    it('recognizes all valid section types', () => {
      const text = `
=== VERSO ===
v

=== REFRÃO ===
r

=== PONTE ===
p

=== INTRO ===
i

=== CIFRA ===
c
      `;
      const partes = parsePartesFromText(text);
      const tipos = partes.map(p => p.tipo);
      expect(tipos).toContain('verso');
      expect(tipos).toContain('refrao');
      expect(tipos).toContain('ponte');
      expect(tipos).toContain('intro');
      expect(tipos).toContain('cifra');
    });

    it('handles mixed case section headers', () => {
      const text = `
=== Verso ===
Content

=== REFRÃO ===
More content
      `;
      const partes = parsePartesFromText(text);
      expect(partes.length).toBeGreaterThan(0);
    });

    it('handles sections with extra spaces', () => {
      const text = `
===   VERSO   ===
Content with spaces
      `;
      const partes = parsePartesFromText(text);
      expect(partes.length).toBeGreaterThan(0);
      expect(partes[0].tipo).toBe('verso');
    });
  });
});
