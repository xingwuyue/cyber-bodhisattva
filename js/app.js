/**
 * 赛博菩萨 - 国潮赛博风彩票号码生成器
 * Cyber Bodhisattva - Guochao Cyberpunk Style
 */

class CyberBodhisattva {
    constructor() {
        this.currentType = 'ssq';
        this.history = this.loadHistory();
        this.blessings = [
            "此组号码暗合天罡，可助施主财运亨通",
            "菩萨慈悲，赐此吉祥之数，望施主善加利用",
            "天机玄妙，这组号码蕴含无上财运",
            "佛光普照，此签大吉，施主可喜可贺",
            "因缘际会，这组号码与施主有缘",
            "善哉善哉，此组号码暗合五行，财运亨通",
            "施主诚心可鉴，菩萨特赐此吉祥号码",
            "此乃上上签，施主可放心使用",
            "运势如虹，这组号码必将带来好运",
            "财运亨通，施主今日必有收获",
            "星辰移位，此组号码暗合天时地利",
            "福缘深厚，这组号码将为施主带来惊喜"
        ];
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.initCanvas();
        this.bindEvents();
        this.renderHistory();
        this.animateParticles();
    }

    // 初始化 Canvas 粒子背景
    initCanvas() {
        this.canvas = document.getElementById('buddhaLight');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        this.createParticles();
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createParticles();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5 - 0.3,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.5 ? '#ffd700' : '#b829dd',
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    animateParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            // 更新位置
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulse += 0.02;
            
            // 边界处理
            if (p.y < -10) {
                p.y = this.canvas.height + 10;
                p.x = Math.random() * this.canvas.width;
            }
            if (p.x < -10) p.x = this.canvas.width + 10;
            if (p.x > this.canvas.width + 10) p.x = -10;
            
            // 绘制粒子
            const pulseOpacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = pulseOpacity;
            this.ctx.fill();
            
            // 光晕效果
            const gradient = this.ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.size * 4
            );
            gradient.addColorStop(0, p.color);
            gradient.addColorStop(1, 'transparent');
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = pulseOpacity * 0.3;
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animateParticles());
    }

    // 绑定事件
    bindEvents() {
        // 彩票类型切换
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentType = btn.dataset.type;
                this.calculateNotes();
            });
        });

        // 金额输入
        document.getElementById('moneyInput').addEventListener('input', () => {
            this.calculateNotes();
        });

        // 生成按钮
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateNumbers();
        });

        // 复制按钮
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyNumbers();
        });

        // 分享按钮
        document.getElementById('shareBtn').addEventListener('click', () => {
            this.shareNumbers();
        });

        // 保存按钮
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveCurrentRecord();
        });

        // 历史记录展开/收起
        document.getElementById('historyHeader').addEventListener('click', () => {
            document.getElementById('historyContent').classList.toggle('show');
            const toggle = document.getElementById('historyToggle');
            toggle.textContent = toggle.textContent === '▼' ? '▲' : '▼';
        });
    }

    // 计算注数
    calculateNotes() {
        const money = parseInt(document.getElementById('moneyInput').value) || 0;
        const perNote = 2;
        const notes = Math.floor(money / perNote);
        
        const resultDiv = document.getElementById('calculateResult');
        if (notes > 0) {
            resultDiv.innerHTML = `可购买 <span>${notes}</span> 注`;
        } else {
            resultDiv.innerHTML = '';
        }
        
        return notes;
    }

    // 生成号码
    generateNumbers() {
        const money = parseInt(document.getElementById('moneyInput').value) || 0;
        if (money < 2) {
            this.showToast('请至少供奉2元香油钱 🙏', 'warning');
            return;
        }

        this.showGeneratingAnimation();

        setTimeout(() => {
            const numbers = this.generateLotteryNumbers();
            this.displayResult(numbers);
            this.hideGeneratingAnimation();
        }, 2500);
    }

    // 显示生成动画
    showGeneratingAnimation() {
        document.getElementById('generatingOverlay').classList.add('show');
    }

    // 隐藏生成动画
    hideGeneratingAnimation() {
        document.getElementById('generatingOverlay').classList.remove('show');
    }

    // 生成彩票号码
    generateLotteryNumbers() {
        if (this.currentType === 'ssq') {
            return this.generateSSQ();
        } else {
            return this.generateDLT();
        }
    }

    // 双色球
    generateSSQ() {
        const redBalls = this.randomUniqueNumbers(1, 33, 6).sort((a, b) => a - b);
        const blueBall = this.randomUniqueNumbers(1, 16, 1)[0];
        return {
            type: 'ssq',
            typeName: '双色球',
            front: redBalls,
            back: [blueBall],
            timestamp: new Date().toISOString()
        };
    }

    // 大乐透
    generateDLT() {
        const frontBalls = this.randomUniqueNumbers(1, 35, 5).sort((a, b) => a - b);
        const backBalls = this.randomUniqueNumbers(1, 12, 2).sort((a, b) => a - b);
        return {
            type: 'dlt',
            typeName: '大乐透',
            front: frontBalls,
            back: backBalls,
            timestamp: new Date().toISOString()
        };
    }

    // 生成不重复的随机数
    randomUniqueNumbers(min, max, count) {
        const numbers = [];
        const available = [];
        for (let i = min; i <= max; i++) available.push(i);
        
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * available.length);
            numbers.push(available[index]);
            available.splice(index, 1);
        }
        
        return numbers;
    }

    // 显示结果
    displayResult(numbers) {
        const panel = document.getElementById('resultPanel');
        const container = document.getElementById('ballsContainer');
        
        panel.classList.add('show');
        container.innerHTML = '';
        
        // 添加前区/红球
        numbers.front.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = `ball ${numbers.type === 'ssq' ? 'red' : 'front'}`;
            ball.textContent = num.toString().padStart(2, '0');
            ball.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(ball);
        });
        
        // 加号
        const plus = document.createElement('div');
        plus.className = 'plus-sign';
        plus.textContent = '+';
        container.appendChild(plus);
        
        // 后区/蓝球
        numbers.back.forEach((num, index) => {
            const ball = document.createElement('div');
            ball.className = `ball ${numbers.type === 'ssq' ? 'blue' : 'back'}`;
            ball.textContent = num.toString().padStart(2, '0');
            ball.style.animationDelay = `${(numbers.front.length + index + 1) * 0.1}s`;
            container.appendChild(ball);
        });

        // 菩萨开示
        const blessing = this.blessings[Math.floor(Math.random() * this.blessings.length)];
        document.getElementById('blessingBox').textContent = blessing;

        // 财运评级
        const starCount = Math.floor(Math.random() * 3) + 3;
        document.getElementById('fortuneStars').textContent = 
            '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

        this.currentResult = numbers;
        this.saveToHistory(numbers);
        
        // 滚动到结果
        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
    }

    // 复制号码
    copyNumbers() {
        if (!this.currentResult) return;
        
        const { typeName, front, back } = this.currentResult;
        const text = `${typeName}: ${front.map(n => n.toString().padStart(2, '0')).join(' ')} + ${back.map(n => n.toString().padStart(2, '0')).join(' ')}`;
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('号码已复制到剪贴板 📋', 'success');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('号码已复制到剪贴板 📋', 'success');
        });
    }

    // 分享号码
    shareNumbers() {
        if (!this.currentResult) return;
        
        const { typeName, front, back } = this.currentResult;
        const text = `🎯 赛博菩萨赐号\n${typeName}: ${front.join(' ')} + ${back.join(' ')}\n🙏 佛光普照，号码天成`;
        
        if (navigator.share) {
            navigator.share({
                title: '赛博菩萨彩票号码',
                text: text
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('分享内容已复制，请粘贴发送给朋友 📱', 'success');
            });
        }
    }

    // 保存当前记录
    saveCurrentRecord() {
        if (!this.currentResult) {
            this.showToast('请先生成号码 🎲', 'warning');
            return;
        }
        this.showToast('号码已保存到历史记录 💾', 'success');
    }

    // 保存到历史
    saveToHistory(record) {
        this.history.unshift(record);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        this.saveHistory();
        this.renderHistory();
    }

    // 加载历史
    loadHistory() {
        try {
            const saved = localStorage.getItem('cyberBodhisattva_history_v2');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    // 保存历史
    saveHistory() {
        try {
            localStorage.setItem('cyberBodhisattva_history_v2', JSON.stringify(this.history));
        } catch (e) {
            console.error('保存历史失败:', e);
        }
    }

    // 渲染历史
    renderHistory() {
        const list = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            list.innerHTML = '<div class="history-item" style="justify-content: center; color: rgba(255,255,255,0.5);">暂无记录</div>';
            return;
        }
        
        list.innerHTML = this.history.slice(0, 10).map(record => {
            const date = new Date(record.timestamp);
            const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            
            return `
                <div class="history-item">
                    <div class="history-info">${timeStr} ${record.typeName}</div>
                    <div class="history-balls">
                        ${record.front.map(n => `
                            <div class="history-ball" style="background: ${record.type === 'ssq' ? 'linear-gradient(135deg, #ee5a5a, #c92a2a)' : 'linear-gradient(135deg, #ff6b6b, #e03131)'}; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">${n.toString().padStart(2, '0')}</div>
                        `).join('')}
                        <span style="color: #ffd700; margin: 0 5px;">+</span>
                        ${record.back.map(n => `
                            <div class="history-ball" style="background: ${record.type === 'ssq' ? 'linear-gradient(135deg, #339af0, #1971c2)' : 'linear-gradient(135deg, #74b816, #538a09)'}; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">${n.toString().padStart(2, '0')}</div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    // 显示 Toast 提示
    showToast(message, type = 'info') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            background: ${type === 'success' ? 'rgba(0, 217, 255, 0.9)' : type === 'warning' ? 'rgba(255, 193, 7, 0.9)' : 'rgba(184, 41, 221, 0.9)'};
            color: ${type === 'warning' ? '#000' : '#fff'};
            border-radius: 10px;
            font-family: 'Noto Serif SC', serif;
            font-size: 14px;
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        toast.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(100px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CyberBodhisattva();
});

// 防止空格键滚动
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
    }
});
