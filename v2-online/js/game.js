// help part
var helping = false;
document.getElementById("action-help").onclick = function() {
    if (helping) {
        helping = false;
        document.getElementById("play-panel").className = "visible";
        document.getElementById("help-panel").className = "";
    } else {
        helping = true;
        document.getElementById("play-panel").className = "";
        document.getElementById("help-panel").className = "visible";
    }
}
// animation part
var ani = new Object();
ani.list = [];
ani.mx = 0;
ani.my = 0;
ani.timer = null;
overlayPanel = document.getElementById("overlay-panel").onmousemove = function(e) {
    ani.mx = e.layerX;
    ani.my = e.layerY;
}
ani.start = function(bx, by, count) {
    if (this.timer != null) {
        window.clearInterval(this.timer);
    }
    var overlayPanel = document.getElementById("overlay-panel");
    this.list.forEach(function(obj) {
        overlayPanel.removeChild(obj.img);
    });
    this.list = [];
    bx *= overlayPanel.clientWidth;
    by *= overlayPanel.clientHeight;
    for (var i = 0; i < count; i++) {
        var obj = new Object();
        var img = document.createElement("img");
        img.className = "swing-img";
        img.src = "img/spider-1.png";
        overlayPanel.appendChild(img);
        obj.img = img;
        obj.x = bx + 50 * (Math.random() - 0.5);
        obj.y = by + 50 * (Math.random() - 0.5);
        obj.vx = Math.random() - 0.5;
        obj.vy = Math.random() - 0.5;
        obj.l = 150;
        this.list.push(obj);
    }
    this.timer = window.setInterval(function() {
        ani.list.forEach(function(obj) {
            var dx = obj.x - ani.mx;
            var dy = obj.y - ani.my;
            var d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0.01) {
                var cos = dx / d;
                var sin = dy / d;
                var nv = cos * obj.vx + sin * obj.vy;
                var tv = cos * obj.vy - sin * obj.vx;
                var f = Math.min(0.0, Math.max(-5.0, 0.1 * (obj.l - d)));
                obj.vx = (0.966 * nv + f) * cos - 0.994 * tv * sin;
                obj.vy = (0.966 * nv + f) * sin + 0.994 * tv * cos + 2.0;
                obj.x += obj.vx;
                obj.y += obj.vy;
                obj.img.style = "transform: matrix(" + (-sin) + "," + cos + "," + (-cos) + "," + (-sin) + "," + obj.x + "," + obj.y + ")";
            } else {
                obj.vy += 2.0;
                obj.x += obj.vx;
                obj.y += obj.vy;
                obj.img.style = "transform: translation(" + obj.x + "," + obj.y + ")";
            }
        });
    }, 50);
};
ani.stop = function() {
    if (this.timer != null) {
        window.clearInterval(this.timer);
    }
    var overlayPanel = document.getElementById("overlay-panel");
    this.list.forEach(function(obj) {
        overlayPanel.removeChild(obj.img);
    });
    this.list = [];
};
// game part
var game = new Object();
game.width = 5;
game.height = 5;
game.population = 1;
game.protection = 1;
game.warmaCreature = false;
game.snowman = null;
game.giraffe = null;
game.egg = null;
game.successiveLose = 0;
game.spiderMove = function(from, to) {
    if (from.spider > 0 && from.tired == 0 && to.state != 0 && to.tired == 0) {
        if (to.creature == 0 && to.spider == 0 || this.giraffe != null && this.giraffe.indexOf(to) >= 0 && to.spider < 3) {
            from.spider--;
            to.spider++;
            from.tired = 0;
            to.tired = 0;
        }
    }
};
game.revealCreature = function(block) {
    switch (block.creature) {
        case 2:
            block.td.style = "background-image: url('img/snowman-1.png');";
            break;
        case 3:
            block.td.style = "background-image: url('img/snowman-1.png'); background-position: -50px 0px;";
            break;
        case 4:
            block.td.style = "background-image: url('img/snowman-1.png'); background-position: 0px -50px;";
            break;
        case 5:
            block.td.style = "background-image: url('img/snowman-1.png'); background-position: -50px -50px;";
            break;
        case 6:
            block.td.style = "background-image: url('img/giraffe-1.png');";
            break;
        case 7:
            block.td.style = "background-image: url('img/giraffe-1.png'); background-position: 0px -50px;";
            break;
        case 8:
            block.td.style = "background-image: url('img/egg-1.png');";
            break;
        case 9:
            block.td.style = "background-image: url('img/hen-1.png');";
            break;
        case 10:
            block.td.style = "background-image: url('img/cat-1-0.png');";
            break;
        case 11:
            block.td.style = "background-image: url('img/cat-1-1.png');";
            break;
        case 12:
            block.td.style = "background-image: url('img/cat-1-2.png');";
            break;
        case 13:
            block.td.style = "background-image: url('img/cat-1-3.png');";
            break;
        case 14:
            block.td.style = "background-image: url('img/cat-1-4.png');";
            break;
    }
}
game.reveal = function() {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var block = this.matrix[x + this.width * y];
            if (block.state == 2) {
                block.state = 1;
            } else if (block.state == 0) {
                if (block.spider > 0) {
                    block.td.className = "bad";
                    block.td.innerHTML = "";
                }
            }
            if (block.state == 1) {
                if (block.creature == 0) {
                    switch (block.spider) {
                        case 1:
                            block.td.style = "background-image: url('img/spider-1.png');";
                            break;
                        case 2:
                            block.td.style = "background-image: url('img/spider-2.png');";
                            break;
                        case 3:
                            block.td.style = "background-image: url('img/spider-3.png');";
                            break;
                        default:
                            block.td.style = "";
                            break;
                    }
                } else {
                    this.revealCreature(block);
                }
            }
        }
    }
};
game.countSpider = function(x, y) {
    var count = 0;
    if (x > 0) {
        count += this.matrix[(x - 1) + this.width * y].spider;
    }
    if (x + 1 < this.width) {
        count += this.matrix[(x + 1) + this.width * y].spider;
    }
    if (y > 0) {
        count += this.matrix[x + this.width * (y - 1)].spider;
        if (x > 0) {
            count += this.matrix[(x - 1) + this.width * (y - 1)].spider;
        }
        if (x + 1 < this.width) {
            count += this.matrix[(x + 1) + this.width * (y - 1)].spider;
        }
    }
    if (y + 1 < this.height) {
        count += this.matrix[x + this.width * (y + 1)].spider;
        if (x > 0) {
            count += this.matrix[(x - 1) + this.width * (y + 1)].spider;
        }
        if (x + 1 < this.width) {
            count += this.matrix[(x + 1) + this.width * (y + 1)].spider;
        }
    }
    return count;
}
game.step = function() {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var block = this.matrix[x + this.width * y];
            if (block.spider == 0) {
                continue;
            }
            var adj = null;
            switch (Math.floor(12 * Math.random())) {
                case 0:
                    if (x > 0) {
                        this.spiderMove(block, this.matrix[(x - 1) + this.width * y]);
                    }
                    break;
                case 1:
                    if (x + 1 < this.width) {
                        this.spiderMove(block, this.matrix[(x + 1) + this.width * y]);
                    }
                    break;
                case 2:
                    if (y > 0) {
                        this.spiderMove(block, this.matrix[x + this.width * (y - 1)]);
                    }
                    break;
                case 3:
                    if (y + 1 < this.height) {
                        this.spiderMove(block, this.matrix[x + this.width * (y + 1)]);
                    }
                    break;
            }
        }
    };
    if (this.snowman != null) {
        var x = this.snowman.px;
        var y = this.snowman.py;
        var start = Math.floor(4 * Math.random());
        for (var i = 0; i < 4; i++) {
            switch ((start + i) % 4) {
                case 0:
                    if (x > 0) {
                        var b1 = this.matrix[(x - 1) + this.width * y];
                        var b2 = this.matrix[(x - 1) + this.width * (y + 1)];
                        if (b1.spider == 0 && b1.tired == 0 && b1.creature == 0 && b2.spider == 0 && b2.tired == 0 && b2.creature == 0) {
                            b1.creature = 2;
                            b2.creature = 4;
                            this.matrix[x + this.width * y].creature = 3;
                            this.matrix[x + this.width * (y + 1)].creature = 5;
                            this.matrix[(x + 1) + this.width * y].creature = 0;
                            this.matrix[(x + 1) + this.width * (y + 1)].creature = 0;
                            this.snowman.px--;
                            i = 4;
                        }
                    }
                    break;
                case 1:
                    if (x + 2 < this.width) {
                        var b1 = this.matrix[(x + 2) + this.width * y];
                        var b2 = this.matrix[(x + 2) + this.width * (y + 1)];
                        if (b1.spider == 0 && b1.tired == 0 && b1.creature == 0 && b2.spider == 0 && b2.tired == 0 && b2.creature == 0) {
                            b1.creature = 3;
                            b2.creature = 5;
                            this.matrix[(x + 1) + this.width * y].creature = 2;
                            this.matrix[(x + 1) + this.width * (y + 1)].creature = 4;
                            this.matrix[x + this.width * y].creature = 0;
                            this.matrix[x + this.width * (y + 1)].creature = 0;
                            this.snowman.px++;
                            i = 4;
                        }
                    }
                    break;
                case 2:
                    if (y > 0) {
                        var b1 = this.matrix[x + this.width * (y - 1)];
                        var b2 = this.matrix[(x + 1) + this.width * (y - 1)];
                        if (b1.spider == 0 && b1.tired == 0 && b1.creature == 0 && b2.spider == 0 && b2.tired == 0 && b2.creature == 0) {
                            b1.creature = 2;
                            b2.creature = 3;
                            this.matrix[x + this.width * y].creature = 4;
                            this.matrix[(x + 1) + this.width * y].creature = 5;
                            this.matrix[x + this.width * (y + 1)].creature = 0;
                            this.matrix[(x + 1) + this.width * (y + 1)].creature = 0;
                            this.snowman.py--;
                            i = 4;
                        }
                    }
                    break;
                case 3:
                    if (y + 2 < this.height) {
                        var b1 = this.matrix[x + this.width * (y + 2)];
                        var b2 = this.matrix[(x + 1) + this.width * (y + 2)];
                        if (b1.spider == 0 && b1.tired == 0 && b1.creature == 0 && b2.spider == 0 && b2.tired == 0 && b2.creature == 0) {
                            b1.creature = 4;
                            b2.creature = 5;
                            this.matrix[x + this.width * (y + 1)].creature = 2;
                            this.matrix[(x + 1) + this.width * (y + 1)].creature = 3;
                            this.matrix[x + this.width * y].creature = 0;
                            this.matrix[(x + 1) + this.width * y].creature = 0;
                            this.snowman.py++;
                            i = 4;
                        }
                    }
                    break;
            }
        }
    }
    if (this.egg != null) {
        var x = this.egg.px;
        var y = this.egg.py;
        if (this.matrix[x + this.width * y].state != 0) {
            if (this.egg.state == 0) {
                if (this.countSpider(x, y) > 0) {
                    this.egg.state = 1;
                }
            } else if (this.egg.state < 9) {
                this.egg.state++;
            }
        }
        if (this.egg.state >= 9) {
            this.matrix[x + this.width * y].creature = 9;
            if (x > 0) {
                this.matrix[(x - 1) + this.width * y].spider = 0;
            }
            if (x + 1 < this.width) {
                this.matrix[(x + 1) + this.width * y].spider = 0;
            }
            if (y > 0) {
                this.matrix[x + this.width * (y - 1)].spider = 0;
                if (x > 0) {
                    this.matrix[(x - 1) + this.width * (y - 1)].spider = 0;
                }
                if (x + 1 < this.width) {
                    this.matrix[(x + 1) + this.width * (y - 1)].spider = 0;
                }
            }
            if (y + 1 < this.height) {
                this.matrix[x + this.width * (y + 1)].spider = 0;
                if (x > 0) {
                    this.matrix[(x - 1) + this.width * (y + 1)].spider = 0;
                }
                if (x + 1 < this.width) {
                    this.matrix[(x + 1) + this.width * (y + 1)].spider = 0;
                }
            }
        }
    }
    var remain = 0;
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            var block = this.matrix[x + this.width * y];
            block.tired = 0;
            if (block.state == 0) {
                var count = this.countSpider(x, y);
                if (block.creature == 0) {
                    block.td.innerHTML = "" + count;
                    block.td.style = "";
                } else {
                    block.td.innerHTML = "";
                    this.revealCreature(block);
                }
                block.td.className = "c" + Math.min(count, 5);
            } else if (block.spider == 0) {
                remain++;
            }
        }
    }
    document.getElementById("remain-count").innerHTML = "剩余数量：" + remain;
    return remain == 0;
};
game.avoid = function(x, y) {
    if (this.protection > 0) {
        var block = this.matrix[x + this.width * y];
        var start = Math.floor(4 * Math.random());
        for (var i = 0; i < 4; i++) {
            switch ((start + i) % 4) {
                case 0:
                    if (x > 0) {
                        this.spiderMove(block, this.matrix[(x - 1) + this.width * y]);
                    }
                    break;
                case 1:
                    if (x + 1 < this.width) {
                        this.spiderMove(block, this.matrix[(x + 1) + this.width * y]);
                    }
                    break;
                case 2:
                    if (y > 0) {
                        this.spiderMove(block, this.matrix[x + this.width * (y - 1)]);
                    }
                    break;
                case 3:
                    if (y + 1 < this.height) {
                        this.spiderMove(block, this.matrix[x + this.width * (y + 1)]);
                    }
                    break;
            }
            if (block.spider == 0) {
                return true;
            }
        }
    }
    return false;
};
game.openBlock = function(x, y) {
    var block = this.matrix[x + this.width * y];
    if (block.state != 0) {
        block.state = 0;
        var imgMain = document.getElementById("img-main");
        if (block.spider == 0 || this.avoid(x, y)) {
            if (this.step()) {
                game.successiveLose = 0;
                imgMain.setAttribute("src", "img/warma-4.png");
            } else {
                imgMain.setAttribute("src", "img/warma-2.png");
                window.setTimeout(function() {
                    if (imgMain.getAttribute("src") == "img/warma-2.png") {
                        imgMain.setAttribute("src", "img/warma-1.png");
                    }
                }, 225);
            }
        } else {
            game.successiveLose++;
            this.reveal();
            if (game.successiveLose >= 3) {
                imgMain.setAttribute("src", "img/warma-5.png");
            } else {
                imgMain.setAttribute("src", "img/warma-3.png");
            }
            document.getElementById("overlay-panel").className = "visible";
            ani.start((x + 0.5) / this.width, (y + 0.5) / this.height, block.spider);
        }
        if (this.protection > 0) {
            this.protection--;
        }
    }
};
game.markBlock = function(x, y) {
    var block = this.matrix[x + this.width * y];
    if (block.state == 1) {
        block.state = 2;
        block.td.className = "flag";
        block.td.innerHTML = "F";
    } else if (block.state == 2) {
        block.state = 1;
        block.td.className = "cx";
        block.td.innerHTML = "";
    }
};
game.start = function() {
    ani.stop();
    this.matrix = [];
    var tbody = document.createElement("tbody");
    for (let y = 0; y < this.height; y++) {
        var row = document.createElement("tr");
        for (let x = 0; x < this.width; x++) {
            var td = document.createElement("td");
            td.className = "cx";
            td.onmousedown = function(e) {
                if (e.button == 0) {
                    game.openBlock(x, y);
                } else if (e.button == 2) {
                    game.markBlock(x, y);
                }
            }
            row.appendChild(td);
            var block = new Object();
            block.state = 1;
            block.spider = 0;
            block.creature = 0;
            block.tired = 0;
            block.td = td;
            this.matrix.push(block);
        }
        tbody.appendChild(row);
    }
    var table = document.getElementById("play-table");
    table.oncontextmenu = function(e){
        e.preventDefault();
    };
    if (table.firstChild != null) {
        table.replaceChild(tbody, table.firstChild);
    } else {
        table.appendChild(tbody);
    }
    var matrixLength = this.matrix.length;
    this.snowman = null;
    this.giraffe = null;
    this.egg = null;
    if (this.warmaCreature) {
        if (this.width >= 4 && this.height >= 4) {
            var x = Math.floor((this.width - 1) * Math.random());
            var y = Math.floor((this.height - 1) * Math.random());
            this.matrix[x + this.width * y].creature = 2;
            this.matrix[(x + 1) + this.width * y].creature = 3;
            this.matrix[x + this.width * (y + 1)].creature = 4;
            this.matrix[(x + 1) + this.width * (y + 1)].creature = 5;
            this.snowman = new Object();
            this.snowman.px = x;
            this.snowman.py = y;
        }
        if (this.width >= 2 && this.height >= 4) {
            for (var i = 0; i < 4; i++) {
                var x = Math.floor(this.width * Math.random());
                var y = Math.floor((this.height - 1) * Math.random());
                var b1 = this.matrix[x + this.width * y];
                var b2 = this.matrix[x + this.width * (y + 1)];
                if (b1.creature == 0 && b2.creature == 0) {
                    b1.creature = 6;
                    b2.creature = 7;
                    this.giraffe = [];
                    if (x > 0) {
                        this.giraffe.push(this.matrix[(x - 1) + this.width * y]);
                        this.giraffe.push(this.matrix[(x - 1) + this.width * (y + 1)]);
                        if (y > 0) {
                            this.giraffe.push(this.matrix[(x - 1) + this.width * (y - 1)]);
                        }
                        if (y + 2 < this.height) {
                            this.giraffe.push(this.matrix[(x - 1) + this.width * (y + 2)]);
                        }
                    }
                    if (x + 1 < this.width) {
                        this.giraffe.push(this.matrix[(x + 1) + this.width * y]);
                        this.giraffe.push(this.matrix[(x + 1) + this.width * (y + 1)]);
                        if (y > 0) {
                            this.giraffe.push(this.matrix[(x + 1) + this.width * (y - 1)]);
                        }
                        if (y + 2 < this.height) {
                            this.giraffe.push(this.matrix[(x + 1) + this.width * (y + 2)]);
                        }
                    }
                    if (y > 0) {
                        this.giraffe.push(this.matrix[x + this.width * (y - 1)]);
                    }
                    if (y + 2 < this.height) {
                        this.giraffe.push(this.matrix[x + this.width * (y + 2)]);
                    }
                    break;
                }
            }
        }
        if (this.width >= 5 && this.height >= 5) {
            for (var i = 0; i < 4; i++) {
                var x = Math.floor(this.width * Math.random());
                var y = Math.floor(this.height * Math.random());
                var b = this.matrix[x + this.width * y];
                if (b.creature == 0) {
                    b.creature = 8;
                    this.egg = new Object();
                    this.egg.px = x;
                    this.egg.py = y;
                    this.egg.state = 0;
                    break;
                }
            }
        }
        for (var i = 0; i < 4; i++) {
            var x = Math.floor(this.width * Math.random());
            var y = Math.floor(this.height * Math.random());
            var b = this.matrix[x + this.width * y];
            if (b.creature == 0) {
                b.creature = 10 + Math.floor(5 * Math.random());
            }
        }
    }
    if (this.population > 0) {
        var j = Math.floor(matrixLength * Math.random());
        var count = 0;
        for (var i = 0; i < matrixLength; i++) {
            var b = this.matrix[j % matrixLength];
            if (b.creature == 0 && b.spider == 0) {
                b.spider = 1;
                count++;
                if (count >= this.population) {
                    break;
                }
            }
            j += 223;
        }
    }
    document.getElementById("img-main").setAttribute("src", "img/warma-1.png");
    document.getElementById("overlay-panel").className = "";
    this.step();
};
function reset() {
    switch(document.getElementById("size-select").selectedIndex) {
        case 0:
            game.width = 9;
            game.height = 8;
            break;
        case 1:
            game.width = 18;
            game.height = 12;
            break;
        case 2:
            game.width = 25;
            game.height = 16;
            break;
    }
    var density = 0.05;
    switch(document.getElementById("difficulty-select").selectedIndex) {
        case 0:
            density = 0.08;
            game.protection = 4;
            break;
        case 1:
            density = 0.15;
            game.protection = 3;
            break;
        case 2:
            density = 0.24;
            game.protection = 2;
            break;
    }
    game.population = Math.floor(density * game.width * game.height);
    game.warmaCreature = document.getElementById("biome-select").selectedIndex == 1;
    game.start();
};
document.getElementById("img-pane").onclick = reset;
document.body.onload = reset;