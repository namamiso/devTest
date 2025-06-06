// パケットクラス
class Packet {
    constructor(x, y, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.ipAddress = '';
        this.hasIP = false;
        this.size = 40;
        this.targetX = x;
        this.targetY = y;
        this.isMoving = false;
        this.moveSpeed = 3;
    }

    draw(ctx) {
        // パケットキャラクターの描画
        ctx.fillStyle = '#FFB6C1'; // ピンク
        ctx.beginPath();
        ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI * 2);
        ctx.fill();

        // 枠線
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 顔の描画
        ctx.fillStyle = '#000';
        
        // 目
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 15, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 15, 2, 0, Math.PI * 2);
        ctx.fill();

        // 口
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 22, 8, 0, Math.PI);
        ctx.stroke();

        // 名前の描画
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px MS Gothic';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.size/2, this.y + this.size + 15);

        // IPアドレスの表示
        if (this.hasIP) {
            ctx.fillStyle = '#4682B4';
            ctx.font = 'bold 8px MS Gothic';
            ctx.fillText(this.ipAddress, this.x + this.size/2, this.y + this.size + 28);
        }
    }

    update() {
        // 移動アニメーション
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > this.moveSpeed) {
                this.x += (dx / distance) * this.moveSpeed;
                this.y += (dy / distance) * this.moveSpeed;
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            }
        }
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
    }

    setIPAddress(ip) {
        this.ipAddress = ip;
        this.hasIP = true;
    }

    contains(mouseX, mouseY) {
        const dx = mouseX - (this.x + this.size/2);
        const dy = mouseY - (this.y + this.size/2);
        return Math.sqrt(dx * dx + dy * dy) <= this.size/2;
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.ipAddress = '';
        this.hasIP = false;
        this.isMoving = false;
    }
}