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

        // 掷圣杯交互
        this.bindSacredCupEvents();

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

    // 掷圣杯事件绑定 - 蓄力版
    bindSacredCupEvents() {
        const btn = document.getElementById('sacredCupBtn');
        const container = document.getElementById('sacredCupContainer');
        const hint = document.getElementById('sacredCupHint');
        const powerFill = document.getElementById('powerFill');
        const chargeParticles = document.getElementById('chargeParticles');
        
        let isHolding = false;
        let holdStartTime = 0;
        let powerInterval = null;
        let particleInterval = null;
        let currentPower = 0;
        
        const startShaking = (e) => {
            e.preventDefault();
            
            const money = parseInt(document.getElementById('moneyInput').value) || 0;
            if (money < 2) {
                this.showToast('请至少供奉2元香油钱 🙏', 'warning');
                return;
            }
            
            isHolding = true;
            holdStartTime = Date.now();
            currentPower = 0;
            
            btn.classList.add('holding');
            container.classList.add('shaking');
            hint.classList.add('shaking-hint');
            hint.innerHTML = '💪 <span class="hint-text">蓄力中...</span>';
            
            // 蓄力进度条动画
            powerInterval = setInterval(() => {
                const elapsed = Date.now() - holdStartTime;
                currentPower = Math.min(elapsed / 2000, 1); // 2秒满蓄力
                powerFill.style.width = `${currentPower * 100}%`;
                
                // 更新提示文字
                if (currentPower < 0.3) {
                    hint.innerHTML = '💪 <span class="hint-text">蓄力中...</span>';
                    container.classList.remove('power-1', 'power-2', 'power-3');
                } else if (currentPower < 0.6) {
                    hint.innerHTML = '🔥 <span class="hint-text">蓄力加强！</span>';
                    container.classList.add('power-1');
                } else if (currentPower < 0.9) {
                    hint.innerHTML = '⚡ <span class="hint-text">全力蓄力！</span>';
                    container.classList.remove('power-1');
                    container.classList.add('power-2');
                } else {
                    hint.innerHTML = '💥 <span class="hint-text">MAX！可以释放了！</span>';
                    container.classList.remove('power-2');
                    container.classList.add('power-3');
                }
            }, 50);
            
            // 生成蓄力粒子
            particleInterval = setInterval(() => {
                this.createChargeParticle(chargeParticles);
            }, 100);
        };
        
        const stopShaking = (e) => {
            if (!isHolding) return;
            e.preventDefault();
            
            isHolding = false;
            const holdDuration = Date.now() - holdStartTime;
            
            // 清除动画
            clearInterval(powerInterval);
            clearInterval(particleInterval);
            
            btn.classList.remove('holding');
            container.classList.remove('shaking', 'power-1', 'power-2', 'power-3');
            hint.classList.remove('shaking-hint');
            
            // 重置进度条
            powerFill.style.width = '0%';
            
            // 清空粒子
            chargeParticles.innerHTML = '';
            
            // 显示掷出动画（传入蓄力程度）
            this.throwSacredCups(holdDuration, currentPower);
        };
        
        // 鼠标事件
        btn.addEventListener('mousedown', startShaking);
        btn.addEventListener('mouseup', stopShaking);
        btn.addEventListener('mouseleave', stopShaking);
        
        // 触摸事件（移动端）
        btn.addEventListener('touchstart', startShaking, { passive: false });
        btn.addEventListener('touchend', stopShaking, { passive: false });
        
        // 防止长按弹出菜单
        btn.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // 创建蓄力粒子
    createChargeParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'charge-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = '100%';
        particle.style.animationDelay = `${Math.random() * 0.3}s`;
        container.appendChild(particle);
        
        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // 创建撞击效果
    createImpactEffect(container, side) {
        // 撞击波纹
        const wave = document.createElement('div');
        wave.className = 'impact-wave';
        wave.style.left = side === 'left' ? '35%' : '65%';
        wave.style.top = '70%';
        container.appendChild(wave);
        wave.classList.add('active');
        
        // 地面裂纹
        const crack = document.createElement('div');
        crack.className = 'ground-crack';
        crack.style.left = side === 'left' ? '35%' : '65%';
        container.appendChild(crack);
        crack.classList.add('active');
        
        // 清理
        setTimeout(() => {
            wave.remove();
            crack.remove();
        }, 600);
    }

    // 创建尘埃粒子
    createDustParticles(container) {
        for (let i = 0; i < 12; i++) {
            const dust = document.createElement('div');
            dust.className = 'dust-particle';
            dust.style.left = '50%';
            dust.style.top = '70%';
            dust.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
            dust.style.setProperty('--ty', `${-Math.random() * 100 - 50}px`);
            dust.style.animation = `dustFly 0.6s ease-out forwards`;
            dust.style.animationDelay = `${i * 0.03}s`;
            container.appendChild(dust);
            
            setTimeout(() => dust.remove(), 600);
        }
    }

    // 播放摇晃音效（模拟）
    playShakeSound() {
        // 这里可以添加真实的音效，暂时用视觉反馈代替
    }

    // 掷圣杯动画 - 爆发释放版（带蓄力加成）
    throwSacredCups(holdDuration, powerLevel) {
        const container = document.getElementById('sacredCupContainer');
        const leftCup = document.getElementById('leftCup');
        const rightCup = document.getElementById('rightCup');
        const resultDiv = document.getElementById('sacredCupResult');
        const hint = document.getElementById('sacredCupHint');
        
        // 根据蓄力程度调整爆发效果
        const intensity = Math.max(powerLevel, 0.3); // 最小30%强度
        
        // 释放冲击感
        container.classList.add('releasing');
        
        // 创建冲击光环（根据蓄力程度调整大小）
        const shockRing = document.createElement('div');
        shockRing.className = 'shock-ring';
        shockRing.style.borderWidth = `${3 + intensity * 5}px`;
        container.appendChild(shockRing);
        
        // 延迟一点点让冲击感更强
        setTimeout(() => {
            shockRing.classList.add('active');
        }, 50);
        
        // 屏幕大震动效果（松开的瞬间）
        document.body.classList.add('screen-shaking');
        setTimeout(() => {
            document.body.classList.remove('screen-shaking');
        }, 500);
        
        // 创建多个冲击波
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const shock = document.createElement('div');
                shock.className = 'shock-ring';
                shock.style.borderWidth = `${5 + i * 3}px`;
                shock.style.animationDelay = `${i * 0.1}s`;
                container.appendChild(shock);
                shock.classList.add('active');
                setTimeout(() => shock.remove(), 700);
            }, i * 100);
        }
        
        // 添加掷出动画 - 根据蓄力程度调整速度
        const throwDuration = 0.6 - (intensity * 0.2); // 蓄力越高越快
        leftCup.style.animationDuration = `${throwDuration}s`;
        rightCup.style.animationDuration = `${throwDuration}s`;
        leftCup.classList.add('throwing-left');
        rightCup.classList.add('throwing-right');
        
        // 更新提示为释放感
        const releaseTexts = ['掷！', '喝！', '哈！', '破！'];
        const releaseText = releaseTexts[Math.floor(intensity * (releaseTexts.length - 1))];
        hint.innerHTML = `💨 <span style="font-size: 28px; color: #ffd700; font-weight: bold; text-shadow: 0 0 20px rgba(255,215,0,0.8);">${releaseText}</span>`;
        hint.style.opacity = '1';
        
        // 第一阶段：掷出
        setTimeout(() => {
            // 强力撞击地面效果
            leftCup.classList.remove('throwing-left');
            rightCup.classList.remove('throwing-right');
            
            // 创建撞击效果
            this.createImpactEffect(container, 'left');
            setTimeout(() => this.createImpactEffect(container, 'right'), 100);
            
            // 尘埃粒子
            this.createDustParticles(container);
            
            // 圣杯落地动画 - 直接设置最终状态
            leftCup.style.animation = 'none';
            rightCup.style.animation = 'none';
            
            // 强制重绘
            void leftCup.offsetWidth;
            void rightCup.offsetWidth;
            
            // 应用撞击动画
            leftCup.style.animation = `hardLand 0.4s ease-out forwards`;
            rightCup.style.animation = `hardLandRight 0.4s ease-out 0.1s forwards`;
            
            // 落地后弹跳
            setTimeout(() => {
                leftCup.style.animation = `bounceAfterLand 0.5s ease-out`;
                rightCup.style.animation = `bounceAfterLandRight 0.5s ease-out 0.1s`;
            }, 400);
            
            // 移除冲击环
            shockRing.remove();
            container.classList.remove('releasing');
            
            // 显示圣杯结果
            const results = this.generateCupResult();
            
            // 蓄力影响结果（满蓄力更容易出圣杯）
            if (intensity > 0.8 && results.result !== '圣杯') {
                // 80%蓄力以上，如果不是圣杯，有30%概率重置为圣杯
                if (Math.random() > 0.7) {
                    results.result = '圣杯';
                    results.meaning = '神明感动，特赐圣杯！';
                    results.className = 'cup-result-sheng';
                }
            }
            
            this.displayCupResult(results);
            
            // 更新提示
            hint.innerHTML = `<span style="color: var(--primary-gold); font-size: 18px;">${results.result}！${results.meaning}</span>`;
            
            // 第二阶段：请示菩萨
            setTimeout(() => {
                hint.innerHTML = '👆 <span style="color: var(--neon-blue);">正在请示菩萨...</span>';
                
                // 显示生成动画遮罩
                this.showGeneratingAnimation();
                
                // 移除落地动画类
                leftCup.classList.remove('landed');
                rightCup.classList.remove('landed');
                
                // 第三阶段：生成号码
                setTimeout(() => {
                    const money = parseInt(document.getElementById('moneyInput').value) || 0;
                    const notes = Math.floor(money / 2);
                    
                    const allNumbers = [];
                    for (let i = 0; i < notes; i++) {
                        const numbers = this.generateLotteryNumbers();
                        numbers.index = i + 1;
                        allNumbers.push(numbers);
                    }
                    this.displayMultiResults(allNumbers, notes);
                    this.hideGeneratingAnimation();
                    
                    // 恢复初始提示
                    setTimeout(() => {
                        hint.innerHTML = '👆 <span class="hint-text">按住下方圣杯蓄力，松开示结果</span>';
                    }, 2000);
                    
                }, 1500);
                
            }, 1000);
            
        }, throwDuration * 1000);
    }

    // 生成圣杯结果
    generateCupResult() {
        // 圣杯：一正一反（吉利）
        // 笑杯：两正（需要再考虑）
        // 阴杯：两反（不吉利）
        const left = Math.random() > 0.5 ? '正' : '反';
        const right = Math.random() > 0.5 ? '正' : '反';
        
        let result, meaning, className;
        
        if ((left === '正' && right === '反') || (left === '反' && right === '正')) {
            result = '圣杯';
            meaning = '神明同意，大吉大利！';
            className = 'cup-result-sheng';
        } else if (left === '正' && right === '正') {
            result = '笑杯';
            meaning = '神明含笑，再求更吉！';
            className = 'cup-result-xiao';
        } else {
            result = '阴杯';
            meaning = '时机未到，另择佳期！';
            className = 'cup-result-yin';
        }
        
        return { left, right, result, meaning, className };
    }

    // 显示圣杯结果
    displayCupResult(results) {
        const resultDiv = document.getElementById('sacredCupResult');
        
        resultDiv.innerHTML = `
            <div class="${results.className}">
                <div style="font-size: 40px; margin-bottom: 10px;">
                    ${results.left === '正' ? '⚪' : '🔴'} ${results.right === '正' ? '⚪' : '🔴'}
                </div>
                <div style="font-size: 24px; font-weight: bold; margin-bottom: 5px;">${results.result}</div>
                <div style="font-size: 14px; opacity: 0.8;">${results.meaning}</div>
            </div>
        `;
        
        resultDiv.classList.add('show');
        
        // 3秒后隐藏结果
        setTimeout(() => {
            resultDiv.classList.remove('show');
        }, 3000);
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
