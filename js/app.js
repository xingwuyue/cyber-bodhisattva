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

        const notes = Math.floor(money / 2);
        this.showGeneratingAnimation();

        setTimeout(() => {
            // 生成多组号码
            const allNumbers = [];
            for (let i = 0; i < notes; i++) {
                const numbers = this.generateLotteryNumbers();
                numbers.index = i + 1; // 添加序号
                allNumbers.push(numbers);
            }
            this.displayMultiResults(allNumbers, notes);
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

    // 显示多组结果
    displayMultiResults(allNumbers, totalNotes) {
        const panel = document.getElementById('resultPanel');
        const container = document.getElementById('ballsContainer');
        const subtitle = document.getElementById('resultSubtitle');
        
        panel.classList.add('show');
        container.innerHTML = '';
        subtitle.textContent = `🎲 共生成 ${totalNotes} 组号码，祝您好运！`;
        
        // 显示标题
        const title = document.createElement('div');
        title.style.cssText = 'font-size: 16px; color: #00d9ff; margin-bottom: 20px; font-family: "Orbitron", sans-serif;';
        title.textContent = totalNotes > 1 ? `💰 ${totalNotes * 2}元 = ${totalNotes}注号码` : '单注号码';
        container.appendChild(title);
        
        // 限制显示数量，太多会卡
        const displayCount = Math.min(allNumbers.length, 10);
        
        for (let i = 0; i < displayCount; i++) {
            const numbers = allNumbers[i];
            
            // 每组号码的容器
            const groupDiv = document.createElement('div');
            groupDiv.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
                padding: 15px;
                background: rgba(0,0,0,0.3);
                border-radius: 10px;
                flex-wrap: wrap;
                justify-content: center;
            `;
            
            // 序号标签
            const indexLabel = document.createElement('div');
            indexLabel.style.cssText = `
                background: linear-gradient(135deg, #ffd700, #ff8c00);
                color: #1a0033;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                margin-right: 5px;
            `;
            indexLabel.textContent = `第${numbers.index}注`;
            groupDiv.appendChild(indexLabel);
            
            // 前区/红球
            numbers.front.forEach((num, idx) => {
                const ball = document.createElement('div');
                ball.className = `ball ${numbers.type === 'ssq' ? 'red' : 'front'}`;
                ball.style.cssText = `
                    width: 45px;
                    height: 45px;
                    font-size: 16px;
                    animation-delay: ${(i * 0.2 + idx * 0.05)}s;
                `;
                ball.textContent = num.toString().padStart(2, '0');
                groupDiv.appendChild(ball);
            });
            
            // 加号
            const plus = document.createElement('div');
            plus.className = 'plus-sign';
            plus.style.cssText = 'font-size: 20px; margin: 0 5px;';
            plus.textContent = '+';
            groupDiv.appendChild(plus);
            
            // 后区/蓝球
            numbers.back.forEach((num, idx) => {
                const ball = document.createElement('div');
                ball.className = `ball ${numbers.type === 'ssq' ? 'blue' : 'back'}`;
                ball.style.cssText = `
                    width: 45px;
                    height: 45px;
                    font-size: 16px;
                    animation-delay: ${(i * 0.2 + (numbers.front.length + idx + 1) * 0.05)}s;
                `;
                ball.textContent = num.toString().padStart(2, '0');
                groupDiv.appendChild(ball);
            });
            
            container.appendChild(groupDiv);
        }
        
        // 如果还有更多
        if (allNumbers.length > 10) {
            const moreDiv = document.createElement('div');
            moreDiv.style.cssText = 'color: #b829dd; font-size: 14px; margin-top: 10px;';
            moreDiv.textContent = `...还有 ${allNumbers.length - 10} 组号码已保存到历史记录`;
            container.appendChild(moreDiv);
        }

        // 菩萨开示
        const blessing = this.blessings[Math.floor(Math.random() * this.blessings.length)];
        document.getElementById('blessingBox').textContent = blessing;

        // 财运评级 - 根据注数评级
        const baseStars = Math.min(Math.floor(totalNotes / 5) + 3, 5);
        const starCount = Math.max(baseStars, 3);
        document.getElementById('fortuneStars').textContent = 
            '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

        this.currentResults = allNumbers;
        
        // 保存所有到历史
        allNumbers.forEach(numbers => this.saveToHistory(numbers));
        
        // 滚动到结果
        setTimeout(() => {
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
    }

    // 显示单组结果（保留旧方法兼容）
    displayResult(numbers) {
        this.displayMultiResults([numbers], 1);
    }

    // 复制号码
    copyNumbers() {
        if (!this.currentResults || this.currentResults.length === 0) {
            this.showToast('请先生成号码 🎲', 'warning');
            return;
        }
        
        const typeName = this.currentResults[0].typeName;
        let text = `☸️ 赛博菩萨赐号 - ${typeName}\n`;
        text += `共${this.currentResults.length}组号码\n\n`;
        
        this.currentResults.forEach((numbers, idx) => {
            text += `第${idx + 1}注: ${numbers.front.map(n => n.toString().padStart(2, '0')).join(' ')} + ${numbers.back.map(n => n.toString().padStart(2, '0')).join(' ')}\n`;
        });
        
        text += '\n🙏 佛光普照，号码天成';
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(`${this.currentResults.length}组号码已复制到剪贴板 📋`, 'success');
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast(`${this.currentResults.length}组号码已复制到剪贴板 📋`, 'success');
        });
    }

    // 分享号码
    shareNumbers() {
        if (!this.currentResults || this.currentResults.length === 0) {
            this.showToast('请先生成号码 🎲', 'warning');
            return;
        }
        
        const typeName = this.currentResults[0].typeName;
        let text = `🎯 赛博菩萨赐号\n${typeName} 共${this.currentResults.length}组\n\n`;
        
        // 只分享前5组，太多会太长
        const shareCount = Math.min(this.currentResults.length, 5);
        for (let i = 0; i < shareCount; i++) {
            const numbers = this.currentResults[i];
            text += `第${i + 1}注: ${numbers.front.join(' ')} + ${numbers.back.join(' ')}\n`;
        }
        
        if (this.currentResults.length > 5) {
            text += `...还有${this.currentResults.length - 5}组\n`;
        }
        
        text += '\n🙏 佛光普照，号码天成';
        
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
        if (!this.currentResults || this.currentResults.length === 0) {
            this.showToast('请先生成号码 🎲', 'warning');
            return;
        }
        this.showToast(`${this.currentResults.length}组号码已保存到历史记录 💾`, 'success');
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
