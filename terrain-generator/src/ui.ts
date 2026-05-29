import type { TerrainConfig } from './types';

function css(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(el.style, styles);
}

export class UIPanel {
  private cfg: TerrainConfig;
  private readonly rebuild: (c: TerrainConfig) => void;

  private wireEl!: HTMLInputElement;
  private islandEl!: HTMLInputElement;
  private seedEl!: HTMLInputElement;
  private heightEl!: HTMLInputElement;
  private heightValEl!: HTMLElement;
  private freqEl!: HTMLInputElement;
  private freqValEl!: HTMLElement;
  private octEl!: HTMLInputElement;
  private octValEl!: HTMLElement;
  private fpsEl!: HTMLElement;
  private polyEl!: HTMLElement;

  constructor(cfg: TerrainConfig, rebuild: (c: TerrainConfig) => void) {
    this.cfg = { ...cfg };
    this.rebuild = rebuild;
    this.buildPanel();
    this.buildStats();
  }

  get wireframe(): boolean {
    return this.wireEl?.checked ?? false;
  }

  updateStats(fps: number, polys: number): void {
    this.fpsEl.textContent = `FPS: ${fps}`;
    this.polyEl.textContent = `Tris: ${polys.toLocaleString()}`;
  }

  private buildPanel(): void {
    const panel = document.createElement('div');
    css(panel, {
      position: 'fixed', top: '16px', left: '16px',
      background: 'rgba(6, 10, 22, 0.92)',
      border: '1px solid rgba(80, 180, 255, 0.28)',
      borderRadius: '10px', padding: '18px 16px',
      color: '#c8e4ff', fontSize: '12px', width: '252px',
      backdropFilter: 'blur(12px)',
      zIndex: '10',
      fontFamily: "'Segoe UI', monospace",
      boxShadow: '0 6px 32px rgba(0,0,0,0.6)',
      userSelect: 'none',
    });

    // Title
    const title = document.createElement('div');
    css(title, {
      fontSize: '13px', fontWeight: '700',
      color: '#60c8ff', marginBottom: '16px',
      letterSpacing: '1.5px', textTransform: 'uppercase',
    });
    title.textContent = '⛰  Terrain Generator';
    panel.appendChild(title);

    // Seed row
    this.seedEl = this.addNumberInput(panel, 'Seed', this.cfg.seed, 0, 999999, 1);

    // Random seed button
    const rndBtn = document.createElement('button');
    rndBtn.textContent = '🎲 Random Seed';
    this.styleSecondaryBtn(rndBtn);
    rndBtn.style.marginBottom = '12px';
    rndBtn.addEventListener('click', () => {
      this.seedEl.value = String(Math.floor(Math.random() * 999999));
    });
    panel.appendChild(rndBtn);

    // Height scale
    [this.heightEl, this.heightValEl] = this.addRange(
      panel, 'Height Scale', this.cfg.heightScale, 10, 150, 1,
      `${this.cfg.heightScale} m`
    );
    this.heightEl.addEventListener('input', () => {
      this.heightValEl.textContent = `${this.heightEl.value} m`;
    });

    // Frequency
    const freqSlider = Math.round(this.cfg.frequency * 10000);
    const fmtFreq = (v: number) => (v / 10000).toFixed(4);
    [this.freqEl, this.freqValEl] = this.addRange(
      panel, 'Frequency', freqSlider, 5, 120, 1,
      fmtFreq(freqSlider)
    );
    this.freqEl.addEventListener('input', () => {
      this.freqValEl.textContent = fmtFreq(parseFloat(this.freqEl.value));
    });

    // Octaves
    [this.octEl, this.octValEl] = this.addRange(
      panel, 'Octaves', this.cfg.octaves, 1, 10, 1,
      String(this.cfg.octaves)
    );
    this.octEl.addEventListener('input', () => {
      this.octValEl.textContent = this.octEl.value;
    });

    // Island mode checkbox
    this.islandEl = this.addCheckbox(panel, 'Island Mode (ocean edges)', this.cfg.islandMode);

    // Wireframe checkbox
    this.wireEl = this.addCheckbox(panel, 'Wireframe', false);

    // Generate button
    const genBtn = document.createElement('button');
    genBtn.textContent = '⟳  GENERATE TERRAIN';
    this.stylePrimaryBtn(genBtn);
    genBtn.addEventListener('click', () => {
      this.rebuild({
        ...this.cfg,
        seed: parseInt(this.seedEl.value) || 42,
        heightScale: parseFloat(this.heightEl.value),
        frequency: parseFloat(this.freqEl.value) / 10000,
        octaves: parseInt(this.octEl.value),
        islandMode: this.islandEl.checked,
      });
    });
    panel.appendChild(genBtn);

    // Hint
    const hint = document.createElement('div');
    css(hint, { marginTop: '12px', color: '#3a7898', fontSize: '10px', lineHeight: '1.7' });
    hint.innerHTML = '🖱 Drag: rotate &nbsp;|&nbsp; Scroll: zoom &nbsp;|&nbsp; RMB: pan';
    panel.appendChild(hint);

    document.body.appendChild(panel);
  }

  private buildStats(): void {
    const stats = document.createElement('div');
    css(stats, {
      position: 'fixed', top: '16px', right: '16px',
      background: 'rgba(6, 10, 22, 0.82)',
      border: '1px solid rgba(80, 180, 255, 0.18)',
      borderRadius: '8px', padding: '12px 16px',
      color: '#60c8ff', fontSize: '11px',
      fontFamily: 'monospace', zIndex: '10',
      backdropFilter: 'blur(8px)',
      minWidth: '150px', lineHeight: '1.9',
    });

    const hdr = document.createElement('div');
    css(hdr, { fontWeight: '700', marginBottom: '4px', color: '#a0d8ff', fontSize: '12px' });
    hdr.textContent = 'PERFORMANCE';
    stats.appendChild(hdr);

    this.fpsEl = document.createElement('div');
    this.fpsEl.textContent = 'FPS: --';
    stats.appendChild(this.fpsEl);

    this.polyEl = document.createElement('div');
    this.polyEl.textContent = 'Tris: --';
    stats.appendChild(this.polyEl);

    const info = document.createElement('div');
    css(info, { color: '#3a7898', marginTop: '6px', fontSize: '10px' });
    info.innerHTML = 'Map: 500 × 500 m<br>Grid: 256 × 256 vtx';
    stats.appendChild(info);

    document.body.appendChild(stats);
  }

  private addNumberInput(
    parent: HTMLElement, label: string,
    value: number, min: number, max: number, step: number
  ): HTMLInputElement {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '10px';

    const lbl = document.createElement('div');
    lbl.textContent = label;
    css(lbl, { color: '#7ab8d8', marginBottom: '4px' });
    wrap.appendChild(lbl);

    const input = document.createElement('input');
    input.type = 'number';
    input.value = String(value);
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    css(input, {
      width: '100%', background: '#080e1c',
      border: '1px solid #1a3a58', color: '#c8e4ff',
      borderRadius: '5px', padding: '6px 8px',
      fontSize: '12px', fontFamily: 'inherit',
    });
    wrap.appendChild(input);
    parent.appendChild(wrap);
    return input;
  }

  private addRange(
    parent: HTMLElement, label: string,
    value: number, min: number, max: number, step: number,
    display: string
  ): [HTMLInputElement, HTMLElement] {
    const wrap = document.createElement('div');
    wrap.style.marginBottom = '10px';

    const hdr = document.createElement('div');
    css(hdr, { display: 'flex', justifyContent: 'space-between', color: '#7ab8d8', marginBottom: '4px' });
    const lbl = document.createElement('span');
    lbl.textContent = label;
    const val = document.createElement('span');
    val.textContent = display;
    css(val, { color: '#a0d8ff' });
    hdr.appendChild(lbl);
    hdr.appendChild(val);
    wrap.appendChild(hdr);

    const input = document.createElement('input');
    input.type = 'range';
    input.value = String(value);
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    css(input, { width: '100%', cursor: 'pointer' });
    (input.style as CSSStyleDeclaration & { accentColor: string }).accentColor = '#3a9fd8';
    wrap.appendChild(input);
    parent.appendChild(wrap);
    return [input, val];
  }

  private addCheckbox(parent: HTMLElement, label: string, checked: boolean): HTMLInputElement {
    const row = document.createElement('div');
    css(row, { display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' });

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = checked;
    css(input, { width: '15px', height: '15px', cursor: 'pointer' });
    (input.style as CSSStyleDeclaration & { accentColor: string }).accentColor = '#3a9fd8';

    const lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.style.cursor = 'pointer';
    row.appendChild(input);
    row.appendChild(lbl);
    parent.appendChild(row);
    return input;
  }

  private stylePrimaryBtn(btn: HTMLButtonElement): void {
    css(btn, {
      width: '100%', padding: '10px',
      background: 'linear-gradient(135deg, #1a5fa8, #0d3266)',
      color: '#fff',
      border: '1px solid #3a9fd8',
      borderRadius: '6px', cursor: 'pointer',
      fontSize: '12px', fontWeight: '700',
      fontFamily: 'inherit', letterSpacing: '0.5px',
      marginTop: '6px',
      transition: 'opacity 0.15s',
    });
    btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.85'; });
    btn.addEventListener('mouseleave', () => { btn.style.opacity = '1'; });
  }

  private styleSecondaryBtn(btn: HTMLButtonElement): void {
    css(btn, {
      width: '100%', padding: '7px',
      background: 'rgba(26, 60, 90, 0.7)',
      color: '#7ab8d8',
      border: '1px solid #1a4060',
      borderRadius: '6px', cursor: 'pointer',
      fontSize: '11px', fontFamily: 'inherit',
      transition: 'opacity 0.15s',
    });
    btn.addEventListener('mouseenter', () => { btn.style.opacity = '0.8'; });
    btn.addEventListener('mouseleave', () => { btn.style.opacity = '1'; });
  }
}
