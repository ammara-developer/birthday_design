import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  selector: 'teacher-birthday',
  templateUrl: './teacher-birthday.component.html',
  styleUrls: ['./teacher-birthday.component.css'],
})
export class TeacherBirthdayComponent implements AfterViewInit, OnDestroy {
  name = 'Miss Aqsa';
  // rotating heading messages (dynamic title)
  titleMessages = [
    `Happy Birthday, ${this.name}! 🎉`,
    `May your code always compile on the first try this year! 🎈`,
    `Celebrate your special day with perfect syntax and plenty of cake!`,
    `May your birthday bring you as much happiness as the sound of code compiling on the first run!🎂`
    
  ];
  titleIndex = 0;
  titleMsg = this.titleMessages[0];

  // rotating subtitle messages
  messages = [
    'Your existence makes the classroom light up ✨',
    'Thank you for inspiring us every day 🌟',
    'May your day be full of smiles and joy 🎂',

  ];
  currentMessage = 0;
  msg = this.messages[0];

  @ViewChild('fireworksCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private raf = 0;
  private last = 0;
  private particles: any[] = [];
  private msgInterval: any;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    // make canvas size follow CSS size and support DPR
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.last = performance.now();
    this.loop(this.last);

    this.msgInterval = setInterval(() => {
      this.currentMessage = (this.currentMessage + 1) % this.messages.length;
      this.msg = this.messages[this.currentMessage];

      this.titleIndex = (this.titleIndex + 1) % this.titleMessages.length;
      this.titleMsg = this.titleMessages[this.titleIndex];
    }, 3500);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    clearInterval(this.msgInterval);
  }

  private resize() {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(300, Math.floor(rect.width * dpr));
    canvas.height = Math.max(200, Math.floor(rect.height * dpr));
    const ctx = this.ctx;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private burst(x: number, y: number) {
    const colors = ['#FF3B3B', '#FF8A00', '#FFD300', '#8AFF7A', '#7AE7FF', '#C47BFF'];
    const count = 32 + Math.floor(Math.random() * 24);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 0.6 + Math.random() * 4.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2 * Math.random(),
        life: 60 + Math.random() * 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1 + Math.random() * 3,
      });
    }
  }

  private loop(now: number) {
    const dt = Math.max(16, now - this.last);
    this.last = now;
    const ctx = this.ctx as CanvasRenderingContext2D;
    const canvas = this.canvasRef.nativeElement;
    if (!ctx) return;

    // a subtle overlay to create particle trails
    ctx.fillStyle = 'rgba(8,8,12,0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // random auto bursts
    if (Math.random() < 0.035) {
      const x = 60 + Math.random() * (canvas.width / (window.devicePixelRatio || 1) - 120);
      const y = 40 + Math.random() * (canvas.height / (window.devicePixelRatio || 1) / 2);
      this.burst(x, y);
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vy += 0.03 * (dt / 16);
      p.x += p.vx * (dt / 16);
      p.y += p.vy * (dt / 16);
      p.life -= dt / 16;
      const alpha = Math.max(0, Math.min(1, p.life / 80));
      ctx.beginPath();
      ctx.fillStyle = this.hexToRgba(p.color, alpha);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    // tiny glints near bottom
    if (Math.random() < 0.02) {
      const x = 20 + Math.random() * (canvas.width / (window.devicePixelRatio || 1) - 40);
      const y = canvas.height / (window.devicePixelRatio || 1) - 40 - Math.random() * 20;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.arc(x, y, 1.2 + Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    this.raf = requestAnimationFrame((t) => this.loop(t));
  }

  private hexToRgba(hex: string, a = 1) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${a})`;
  }

  onClick(ev: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    this.burst(x, y);
  }
}
