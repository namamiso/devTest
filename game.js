// メインゲームクラス
class NetworkGame {
    constructor(stageNumber) {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.stageNumber = stageNumber;
        this.nodes = [];
        this.packet = null;
        this.gameCompleted = false;
        this.progress = 0;
        
        this.setupEventListeners();
        this.initializeStage();
        this.gameLoop();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    initializeStage() {
        this.nodes = [];
        this.gameCompleted = false;
        this.progress = 0;
        this.updateProgress();

        switch (this.stageNumber) {
            case 1:
                this.initializeStage1();
                break;
            case 2:
                this.initializeStage2();
                break;
            case 3:
                this.initializeStage3();
                break;
        }
    }

    initializeStage1() {
        this.updateHint('パケット君にIPアドレスを設定して、目的地まで送り届けよう！');
        
        // パケット（主人公）
        this.packet = new Packet(100, 300, 'パケット君');
        
        // ネットワークノード
        this.nodes.push(new NetworkNode(300, 200, 'ルーター1', 'router'));
        this.nodes.push(new NetworkNode(500, 300, 'ルーター2', 'router'));
        this.nodes.push(new NetworkNode(700, 200, '目的地', 'destination'));
        
        // IPアドレス設定エリア
        this.nodes.push(new NetworkNode(150, 100, '192.168.1.1', 'ip-address'));
        this.nodes.push(new NetworkNode(250, 100, '192.168.1.2', 'ip-address'));
    }

    initializeStage2() {
        this.updateHint('複数の経路から最適なルートを選択しよう！');
        
        this.packet = new Packet(100, 300, 'パケット君');
        
        // より複雑なネットワーク構成
        this.nodes.push(new NetworkNode(250, 150, 'ルーター1', 'router'));
        this.nodes.push(new NetworkNode(250, 350, 'ルーター2', 'router'));
        this.nodes.push(new NetworkNode(450, 200, 'ルーター3', 'router'));
        this.nodes.push(new NetworkNode(450, 400, 'ルーター4', 'router'));
        this.nodes.push(new NetworkNode(650, 300, '目的地', 'destination'));
    }

    initializeStage3() {
        this.updateHint('サブネットを使ってネットワークを効率的に分割しよう！');
        
        this.packet = new Packet(100, 300, 'パケット君');
        
        // サブネット構成
        this.nodes.push(new NetworkNode(300, 150, 'サブネット1', 'subnet'));
        this.nodes.push(new NetworkNode(300, 350, 'サブネット2', 'subnet'));
        this.nodes.push(new NetworkNode(500, 250, 'メインルーター', 'router'));
        this.nodes.push(new NetworkNode(700, 250, '目的地', 'destination'));
    }

    handleClick(event) {
        if (this.gameCompleted) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // ノードのクリック判定
        for (let node of this.nodes) {
            if (node.contains(x, y)) {
                this.handleNodeClick(node);
                return;
            }
        }

        // パケットのクリック判定
        if (this.packet && this.packet.contains(x, y)) {
            this.handlePacketClick();
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // ホバー効果
        for (let node of this.nodes) {
            node.setHovered(node.contains(x, y));
        }

        this.canvas.style.cursor = 'default';
        for (let node of this.nodes) {
            if (node.contains(x, y)) {
                this.canvas.style.cursor = 'pointer';
                break;
            }
        }
        if (this.packet && this.packet.contains(x, y)) {
            this.canvas.style.cursor = 'pointer';
        }
    }

    handleNodeClick(node) {
        switch (this.stageNumber) {
            case 1:
                this.handleStage1NodeClick(node);
                break;
            case 2:
                this.handleStage2NodeClick(node);
                break;
            case 3:
                this.handleStage3NodeClick(node);
                break;
        }
    }

    handleStage1NodeClick(node) {
        if (node.type === 'ip-address' && !this.packet.hasIP) {
            this.packet.setIPAddress(node.name);
            this.updateHint('IPアドレスが設定されました！目的地をクリックして移動しよう！');
            this.updateProgress(50);
        } else if (node.type === 'destination' && this.packet.hasIP) {
            this.packet.moveTo(node.x, node.y);
            this.updateHint('おめでとう！パケット君が目的地に到着しました！');
            this.updateProgress(100);
            this.gameCompleted = true;
            
            setTimeout(() => {
                window.completeStage(); // Assuming completeStage is a global function
            }, 2000);
        } else if (node.type === 'destination' && !this.packet.hasIP) {
            this.updateHint('IPアドレスが設定されていません！まずIPアドレスを設定してください。');
        }
    }

    handleStage2NodeClick(node) {
        // ステージ2のロジック（簡略化）
        if (node.type === 'destination') {
            this.packet.moveTo(node.x, node.y);
            this.updateHint('ステージ2クリア！効率的なルートを見つけました！');
            this.updateProgress(100);
            this.gameCompleted = true;
            
            setTimeout(() => {
                window.completeStage(); // Assuming completeStage is a global function
            }, 2000);
        }
    }

    handleStage3NodeClick(node) {
        // ステージ3のロジック（簡略化）
        if (node.type === 'destination') {
            this.packet.moveTo(node.x, node.y);
            this.updateHint('ステージ3クリア！サブネットを理解しました！');
            this.updateProgress(100);
            this.gameCompleted = true;
            
            setTimeout(() => {
                window.completeStage(); // Assuming completeStage is a global function
            }, 2000);
        }
    }

    handlePacketClick() {
        if (this.stageNumber === 1 && !this.packet.hasIP) {
            this.updateHint('まずIPアドレスを設定してください！上のIPアドレスをクリック！');
        }
    }

    updateHint(text) {
        document.getElementById('hint-text').textContent = text;
    }

    updateProgress(value = this.progress) {
        this.progress = value;
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        progressFill.style.width = value + '%';
        progressText.textContent = `進行度: ${value}%`;
    }

    gameLoop() {
        this.update();
        this.draw();
        
        if (!this.gameCompleted) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        if (this.packet) {
            this.packet.update();
        }
    }

    draw() {
        // 背景をクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 接続線を描画
        this.drawConnections();
        
        // ネットワークノードを描画
        for (let node of this.nodes) {
            node.draw(this.ctx);
        }
        
        // パケットを描画
        if (this.packet) {
            this.packet.draw(this.ctx);
        }
    }

    drawConnections() {
        this.ctx.strokeStyle = '#808080';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        
        // ステージに応じた接続線を描画
        if (this.stageNumber === 1) {
            // 簡単な接続線
            const routerNodes = this.nodes.filter(node => 
                node.type === 'router' || node.type === 'destination'
            );
            
            for (let i = 0; i < routerNodes.length - 1; i++) {
                const node1 = routerNodes[i];
                const node2 = routerNodes[i + 1];
                
                this.ctx.beginPath();
                this.ctx.moveTo(node1.x + node1.size/2, node1.y + node1.size/2);
                this.ctx.lineTo(node2.x + node2.size/2, node2.y + node2.size/2);
                this.ctx.stroke();
            }
        }
        
        this.ctx.setLineDash([]);
    }

    reset() {
        this.initializeStage();
    }

    destroy() {
        // クリーンアップ
        this.gameCompleted = true;
    }
}

// Assuming Packet and NetworkNode classes are defined elsewhere
class Packet {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.hasIP = false;
    }

    setIPAddress(ip) {
        this.hasIP = true;
        this.ip = ip;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
        // Update logic for packet
    }

    draw(ctx) {
        // Drawing logic for packet
    }

    contains(x, y) {
        // Collision detection logic for packet
        return false;
    }
}

class NetworkNode {
    constructor(x, y, name, type) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type;
        this.hovered = false;
        this.size = 50; // Example size
    }

    setHovered(hovered) {
        this.hovered = hovered;
    }

    draw(ctx) {
        // Drawing logic for network node
    }

    contains(x, y) {
        // Collision detection logic for network node
        return false;
    }
}

// Assuming completeStage function is defined elsewhere
function completeStage() {
    // Logic to complete the stage
}