class FlipClockCard extends HTMLElement {
  setConfig(config) {
    const commonPadding = config.padding !== undefined ? config.padding : null;

    this._config = {
      bg_color: config.bg_color || 'rgba(0, 0, 0, 1)',
      text_color: config.text_color || 'rgba(200, 200, 200, 1)',
      bg_color_bottom: config.bg_color_bottom || 'rgba(50, 50, 50, 1)',
      text_color_bottom: config.text_color_bottom || 'rgba(255, 255, 255, 1)',
      border_radius: config.border_radius !== undefined ? config.border_radius : 10,
      font_size: config.font_size || '4vw',
      font_family: config.font_family || 'JetBrains Mono',
      card_width: config.card_width || 1,   
      card_height: config.card_height || 1.5,
      padding_top: config.padding_top !== undefined ? config.padding_top : (commonPadding !== null ? commonPadding : '3%'),
      padding_bottom: config.padding_bottom !== undefined ? config.padding_bottom : (commonPadding !== null ? commonPadding : '3%'),
      padding_left: config.padding_left !== undefined ? config.padding_left : (commonPadding !== null ? commonPadding : '3%'),
      padding_right: config.padding_right !== undefined ? config.padding_right : (commonPadding !== null ? commonPadding : '3%'),
      ...config
    };
  }

  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;

    const root = this.attachShadow({ mode: 'open' });
    this._loadGoogleFont(this._config.font_family);

    const container = document.createElement('ha-card');
    
    const toPx = (val) => (typeof val === 'number' ? val + 'px' : val);
    
    const radius = toPx(this._config.border_radius);
    const fontSize = toPx(this._config.font_size);
    const cWidth = typeof this._config.card_width === 'number' ? this._config.card_width + 'em' : this._config.card_width;
    const cHeight = typeof this._config.card_height === 'number' ? this._config.card_height + 'em' : this._config.card_height;

    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=${this._config.font_family.replace(/\s+/g, '+')}:wght@400;700;900&display=swap');

      ha-card {
        background: transparent !important;
        box-shadow: none !important;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box !important;
        padding-top: ${toPx(this._config.padding_top)} !important;
        padding-bottom: ${toPx(this._config.padding_bottom)} !important;
        padding-left: ${toPx(this._config.padding_left)} !important;
        padding-right: ${toPx(this._config.padding_right)} !important;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .flip-clock {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        max-width: 100%;
        gap: 0.5em;
        box-sizing: border-box;
      }
      .flip-clock__piece {
        display: flex;
        gap: 0.2em;
        flex-shrink: 1;
        min-width: 0;
      }
      .card {
        display: block;
        position: relative;
        width: ${cWidth};
        height: ${cHeight};
        font-size: ${fontSize};
        font-family: '${this._config.font_family}', sans-serif;
        font-weight: 900;
        line-height: ${cHeight};
        flex-shrink: 1;
      }
      .card__top, .card__bottom, .card__back::before, .card__back::after {
        display: block; height: 50%; width: 100%; color: ${this._config.text_color};
        background: ${this._config.bg_color}; border-radius: ${radius} ${radius} 0 0;
        backface-visibility: hidden; transform-style: preserve-3d; box-sizing: border-box; text-align: center; overflow: hidden; position: absolute; top: 0;
      }
      .card__bottom {
        color: ${this._config.text_color_bottom}; top: 50%; background: ${this._config.bg_color_bottom};
        border-radius: 0 0 ${radius} ${radius}; border-top: solid 1px rgba(0,0,0,0.1);
      }
      .card__bottom::after {
        display: block; content: attr(data-value); margin-top: calc(${cHeight} * -0.5); 
      }
      .card__back::before { content: attr(data-value); position: relative; z-index: -1; }
      .card__back { position: absolute; top: 0; height: 100%; width: 100%; pointer-events: none; }
      
      .flip .card__back::before { animation: flipTop 0.3s cubic-bezier(0.37, 0.01, 0.94, 0.35) both; transform-origin: center bottom; }
      .flip .card__back .card__bottom { transform-origin: center top; animation: flipBottom 0.6s cubic-bezier(0.15, 0.45, 0.28, 1) both; }
      @keyframes flipTop { 0% { transform: rotateX(0deg); z-index: 2; opacity: 0.99; } 100% { transform: rotateX(-90deg); opacity: 0; } }
      @keyframes flipBottom { 0%, 50% { z-index: -1; transform: rotateX(90deg); opacity: 0; } 51% { opacity: 0.99; } 100% { opacity: 0.99; transform: rotateX(0deg); z-index: 5; } }
    `;

    const content = document.createElement('div');
    content.className = 'flip-clock';
    content.innerHTML = `${this._createGroup('hour')}${this._createGroup('minute')}${this._createGroup('second')}`;

    container.appendChild(style);
    container.appendChild(content);
    root.appendChild(container);

    this._content = content;
    this._updateClock();
    setInterval(() => this._updateClock(), 1000);
  }

  _loadGoogleFont(font) {
    const fontId = 'google-font-' + font.replace(/\s+/g, '-').toLowerCase();
    if (!document.getElementById(fontId)) {
      const link = document.createElement('link'); link.id = fontId; link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${font.replace(/\s+/g, '+')}:wght@400;700;900&display=swap`;
      document.head.appendChild(link);
    }
  }

  _createGroup(unit) { return `<div class="flip-clock__piece">${this._createDigit(unit, 'd2')}${this._createDigit(unit, 'd1')}</div>`; }
  _createDigit(unit, pos) { return `<b class="card" id="${unit}-${pos}"><b class="card__top">0</b><b class="card__bottom" data-value="0"></b><b class="card__back" data-value="0"><b class="card__bottom" data-value="0"></b></b></b>`; }
  _updateClock() {
    const now = new Date();
    const timeData = { hour: String(now.getHours()).padStart(2, '0'), minute: String(now.getMinutes()).padStart(2, '0'), second: String(now.getSeconds()).padStart(2, '0') };
    ['hour', 'minute', 'second'].forEach(unit => { this._updateDigit(unit, 'd2', timeData[unit].charAt(0)); this._updateDigit(unit, 'd1', timeData[unit].charAt(1)); });
  }
  _updateDigit(unit, pos, newVal) {
    const el = this.shadowRoot.getElementById(`${unit}-${pos}`);
    const top = el.querySelector('.card__top');
    if (newVal !== top.innerText) {
      const bottom = el.querySelector('.card__bottom'); const back = el.querySelector('.card__back'); const backBottom = el.querySelector('.card__back .card__bottom');
      back.setAttribute('data-value', top.innerText); bottom.setAttribute('data-value', top.innerText);
      top.innerText = newVal; backBottom.setAttribute('data-value', newVal);
      el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip');
    }
  }
}
customElements.define('flip-clock-card', FlipClockCard);
