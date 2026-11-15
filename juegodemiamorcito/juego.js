// ==========================================
// 1. EL MENU PRINCIPAL
// ==========================================
class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    
    preload() { 
        this.load.image('fondo-menu', 'fondo-menu.jpg'); 
        this.load.image('panel-estrellas', 'panel-estrellas.png');
        this.load.image('btn-jugar', 'btn-jugar.png'); 
        this.load.image('btn-carta', 'btn-carta.png');
        this.load.image('btn-estiven', 'btn-estiven.png'); 
        this.load.image('btn-salir', 'btn-salir.png');
    }
    
    create() {
        const ancho = this.scale.width;
        const alto = this.scale.height;
        let centroX = ancho / 2;
        let centroY = alto / 2;
        
        try { 
            let fondo = this.add.image(centroX, centroY, 'fondo-menu'); 
            fondo.setScale(Math.max(ancho / fondo.width, alto / fondo.height)); 
        } catch (e) {}
        
        this.add.image(centroX, centroY, 'panel-estrellas').setScale(0.33);

        let escalaBoton = 0.22;
        let inicioY = centroY - 45;
        let separacion = 42; 

        this.crearBotonImagen(centroX, inicioY, 'btn-jugar', escalaBoton, () => { 
            this.scene.start('Nivel1'); 
        });
        
        this.crearBotonImagen(centroX, inicioY + separacion, 'btn-carta', escalaBoton, () => { 
            this.scene.start('ScrapbookScene'); 
        });
        
        this.crearBotonImagen(centroX, inicioY + (separacion * 2), 'btn-estiven', escalaBoton, () => {
            this.mostrarPestana("PARA MI ESTIVEN :3", "Feliz cumpleanos, mi amor hermoso!\n\nTe amo muchisimo.\nPerdon si este jueguito no es lo mejor del mundo, pero esta hecho con todo mi corazon para ti.\n\nGracias por ser mi persona favorita!");
        });
        
        this.crearBotonImagen(centroX, inicioY + (separacion * 3), 'btn-salir', escalaBoton, () => {
            alert("De mi corazon no puedes salir! \n\n(Cierra la pestana para salir)");
        });

        this.crearMiniPestana(ancho, alto, centroX, centroY);
    }

    crearMiniPestana(ancho, alto, centroX, centroY) {
        this.pestana = this.add.container(centroX, centroY).setDepth(100).setVisible(false);
        
        let fondoOscuro = this.add.rectangle(0, 0, ancho, alto, 0x000000, 0.65).setInteractive(); 
        
        let cuadro = this.add.graphics();
        cuadro.fillStyle(0xe6f9ff, 1); 
        cuadro.fillRoundedRect(-230, -185, 460, 370, 24); 
        cuadro.lineStyle(6, 0x88ccff); 
        cuadro.strokeRoundedRect(-230, -185, 460, 370, 24);

        this.tituloPestana = this.add.text(0, -140, 'MENSAJE', { 
            fontFamily: "'Fredoka', sans-serif", fontSize: '26px', color: '#1a365d', fontStyle: 'bold' 
        }).setOrigin(0.5);
        
        this.textoPestana = this.add.text(0, -10, 'Texto...', { 
            fontFamily: "'Fredoka', sans-serif", fontSize: '18px', color: '#2c5282', align: 'center', lineSpacing: 6, wordWrap: { width: 390 } 
        }).setOrigin(0.5);

        let btnCerrar = this.add.text(0, 135, 'X CERRAR', { 
            fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#ff6688', padding: { x: 18, y: 10 } 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        btnCerrar.on('pointerover', () => btnCerrar.setScale(1.08)); 
        btnCerrar.on('pointerout', () => btnCerrar.setScale(1)); 
        btnCerrar.on('pointerdown', () => this.pestana.setVisible(false));

        this.pestana.add([fondoOscuro, cuadro, this.tituloPestana, this.textoPestana, btnCerrar]);
    }

    mostrarPestana(titulo, texto) { 
        this.tituloPestana.setText(titulo); 
        this.textoPestana.setText(texto); 
        this.pestana.setVisible(true); 
    }

    crearBotonImagen(x, y, claveImagen, escalaOriginal, onClick) {
        let btn = this.add.image(x, y, claveImagen).setScale(escalaOriginal).setInteractive({ useHandCursor: true, pixelPerfect: true });
        btn.on('pointerover', () => btn.setScale(escalaOriginal * 1.06)); 
        btn.on('pointerout', () => btn.setScale(escalaOriginal));
        btn.on('pointerdown', () => { 
            btn.setScale(escalaOriginal * 0.94); 
            this.time.delayedCall(120, () => { 
                btn.setScale(escalaOriginal); onClick(); 
            }); 
        });
    }
}

// ==========================================
// 2. MOTOR BASE PARA TODOS LOS NIVELES
// ==========================================
class NivelBase extends Phaser.Scene {
    constructor(claveEscena) { super(claveEscena); }

    estiloTextoBonito(tamano = '22px', colorTexto = '#ffffff', colorBorde = '#1a365d', grosorBorde = 5) {
        return { fontFamily: "'Fredoka', sans-serif", fontSize: tamano, color: colorTexto, fontStyle: 'bold', stroke: colorBorde, strokeThickness: grosorBorde, shadow: { offsetX: 0, offsetY: 3, color: 'rgba(0,0,0,0.45)', blur: 4, stroke: true, fill: true } };
    }

    preloadComun() {
        this.load.image('fondo-inicio', 'fondo-inicio.jpg'); 
        this.load.image('fondo-menu', 'fondo-menu.jpg');
        this.load.image('fondo-mitad', 'fondo-mitad.jpg'); 
        this.load.image('fondo-final', 'fondo-final.jpg');
        
        this.load.image('piso-hielo', 'piso-hielo.png'); 
        this.load.image('bloque-m', 'bloque-m.png'); 
        this.load.image('bloque-p', 'bloque-p.png'); 
        this.load.image('rampa-larga', 'rampa-larga.png');

        this.load.image('pin-parado', 'pa.png'); 
        this.load.image('pin-caminar-1', 'pb.png'); 
        this.load.image('pin-caminar-2', 'pc.png'); 
        this.load.image('pin-caminar-3', 'pd.png');
        
        this.load.image('pin-salt', 'pin-salt.png'); 
        this.load.image('pin-barriga', 'pin-barriga.png'); 
        this.load.image('pin-caida', 'pin-caida.png'); 
        this.load.image('pin-golpeado', 'pin-golpeado.png');
        
        this.load.image('pin-asustado', 'pin-asustado.png');
        this.load.image('pin-expl', 'pin-expl.png'); 
        this.load.image('pin-eno', 'pin-eno.png');
        this.load.image('pin-reg', 'pin-reg.png');

        this.load.image('pat-caminando1', 'pat-caminando1.png'); 
        this.load.image('pat-caminando2', 'pat-caminando2.png');
        this.load.image('pat-feliz', 'pat-feliz.png');
        this.load.image('pat-magia1', 'pat-magia1.png'); 
        this.load.image('pat-magia2', 'pat-magia2.png');
        this.load.image('pat-magia3', 'pat-magia3.png'); 
        this.load.image('pat-regalo', 'pat-regalo.png');

        this.load.image('pin-ataque-1', 'pin-ataque-1.png'); 
        this.load.image('pin-ataque-2', 'pin-ataque-2.png');
        this.load.image('pin-ataque-3', 'pin-ataque-3.png');
        
        this.load.image('enemigo-1', 'enemigo-1.png'); 
        this.load.image('enemigo-muerto', 'enemigo-1-muerto.png');
        this.load.image('jefe-normal', 'jefe-normal.png'); 
        this.load.image('jefe-muerto', 'jefe-muerto.png');
        this.load.image('explosion', 'explosion.png'); 
    }

    iniciarMundoBase(anchoMundo, claveFondo, nombreNivelTexto) {
        this.input.addPointer(3);
        
        this.physics.world.setBounds(0, 0, anchoMundo, 800);
        this.physics.world.setBoundsCollision(true, true, true, false); 
        this.cameras.main.setBounds(0, 0, anchoMundo, 600);

        if (!this.anims.exists('caminar') && this.textures.exists('pin-caminar-1')) {
            this.anims.create({ key: 'caminar', frames: [{ key: 'pin-caminar-1' }, { key: 'pin-caminar-2' }, { key: 'pin-caminar-3' }], frameRate: 10, repeat: -1 });
        }
        if (!this.anims.exists('atacar') && this.textures.exists('pin-ataque-1')) {
            this.anims.create({ key: 'atacar', frames: [{ key: 'pin-ataque-1' }, { key: 'pin-ataque-2' }, { key: 'pin-ataque-3' }], frameRate: 12, repeat: 0 });
        }

        let contador = 0;
        for (let x = 0; x < anchoMundo; x += 800) {
            let bg = this.add.image(x, 0, claveFondo).setOrigin(0, 0);
            bg.setDisplaySize(800, 600); 
            if (contador % 2 === 1) bg.setFlipX(true); 
            contador++;
        }

        this.suelos = this.physics.add.staticGroup(); 
        this.plataformas = this.physics.add.staticGroup();
        this.plataformasQueCaen = this.physics.add.group({ allowGravity: false, immovable: true });
        this.escalonesRampa = this.physics.add.staticGroup(); 
        this.enemigos = this.physics.add.group();
        this.itemsAmor = this.physics.add.group({ allowGravity: false });

        this.puntoGuardadoX = 150; 
        this.guardadoActivo = false;
        
        this.player = this.physics.add.sprite(this.puntoGuardadoX, 400, 'pin-parado');
        this.player.setCollideWorldBounds(true); 
        this.player.body.setGravityY(800); 
        this.player.setDepth(50);

        this.ANCHO_PIN = 90; 
        this.ALTO_PIN = 90; 
        this.TAMANO_JEFE = 260; 
        this.HUNDIR_PIES = 0.22; 
        this.forzarTamanoPinguino(false);

        this.vidas = 3; this.esInvencible = false; this.modoSuperPinguino = false; this.enEstadoPancita = false; 
        this.estaAtacando = false; this.estaGolpeado = false; this.nivelTerminado = false; this.ultimoContactoRampa = 0; 
        this.ultimoRastroNieve = 0; this.jefeDerrotado = false;

        this.physics.add.collider(this.player, this.suelos); 
        this.physics.add.collider(this.player, this.plataformas); 
        this.physics.add.collider(this.enemigos, this.suelos); 
        this.physics.add.collider(this.enemigos, this.plataformas);
        
        this.physics.add.collider(this.player, this.plataformasQueCaen, (jugador, bloque) => {
            if (jugador.body.touching.down && !bloque.cayendo) {
                bloque.cayendo = true; bloque.setTint(0xff5533);
                this.tweens.add({ targets: bloque, x: bloque.x + 5, duration: 45, yoyo: true, repeat: 5, onComplete: () => { if (bloque && bloque.body) { bloque.body.setImmovable(false); bloque.body.setAllowGravity(true); bloque.body.setGravityY(900); } } });
            }
        });

        this.physics.add.collider(this.player, this.escalonesRampa, (jugador) => { 
            this.ultimoContactoRampa = this.time.now; 
            if (!this.cursors.left.isDown && !this.touchIzq) { jugador.setVelocityX(360); jugador.setVelocityY(140); } 
        });

        this.physics.add.overlap(this.player, this.enemigos, (jugador, enemigo) => {
            if (enemigo.estaMuerto || enemigo.inmuneGolpe) return;
            if (this.estaAtacando || (this.modoSuperPinguino && !enemigo.esJefe)) {
                enemigo.inmuneGolpe = true; 
                let dano = this.modoSuperPinguino ? 2 : 1; 
                enemigo.vidas -= dano;
                this.mostrarDanoFlotante(enemigo.x, enemigo.y - 30, dano, dano > 1); 
                this.aplicarRetrocesoEnemigo(enemigo, jugador);
                
                if (enemigo.esJefe) {
                    if (this.actualizarBarraJefe) this.actualizarBarraJefe(enemigo.vidas);
                    this.tweens.add({ targets: enemigo, alpha: 0.3, duration: 80, yoyo: true, repeat: 4, onComplete: () => { if (enemigo && enemigo.active) enemigo.alpha = 1; } });
                    if (enemigo.vidas <= 0) this.matarEnemigoConEstilo(enemigo);
                } else {
                    this.actualizarMiniBarraEnemigo(enemigo);
                    if (enemigo.vidas <= 0) { this.matarEnemigoConEstilo(enemigo); } else { enemigo.setTintFill(0xffffff); this.time.delayedCall(150, () => { if (enemigo && enemigo.active) enemigo.clearTint(); }); }
                }
            } else if (!this.esInvencible && !this.modoSuperPinguino && !this.estaGolpeado) { 
                this.recibirDano(); 
            }
        });

        this.physics.add.overlap(this.player, this.itemsAmor, (jugador, item) => {
            if (item.recogido) return; 
            item.recogido = true; 
            if (item.auraVisual) item.auraVisual.destroy(); 
            if (item.textoVisual) item.textoVisual.destroy();
            item.destroy();
            
            if (item.tipoItem === 'verde') { 
                this.activarModoSuperPinguino(); 
            } else { 
                if (this.vidas < 3) this.vidas++; 
                this.actualizarTextoVidas(); 
                this.mostrarAvisoFlotante(this.player.x, this.player.y - 40, '+1 VIDA', '#ff4466'); 
            }
        });

        this.textoVidas = this.add.text(22, 18, 'VIDAS: 3', this.estiloTextoBonito('24px', '#ff5566', '#2d0000', 5)).setScrollFactor(0).setDepth(100);
        this.textoSuper = this.add.text(400, 92, 'SUPER PINGUINO ACTIVADO!', this.estiloTextoBonito('22px', '#55ff99', '#003311', 6)).setOrigin(0.5).setScrollFactor(0).setDepth(150).setVisible(false);
        this.add.text(778, 18, nombreNivelTexto, this.estiloTextoBonito('22px', '#ffffff', '#1a365d', 5)).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        this.cameras.main.startFollow(this.player, true, 0.08, 0.08); 
        this.cameras.main.setDeadzone(180, 100); 
        this.cursors = this.input.keyboard.createCursorKeys(); 
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        
        this.crearControlesIphone();

        if (this.scene.key === 'Nivel1' || this.scene.key === 'Nivel2') {
            this.time.addEvent({
                delay: 2000, 
                callback: () => {
                    if (this.nivelTerminado || this.jefeDerrotado || this.estaGolpeado) return;
                    let spawnX = this.cameras.main.scrollX + 850; 
                    if (spawnX < anchoMundo - 150) this.crearEnemigoUnico(spawnX, 50, -130); 
                },
                loop: true
            });
        }
    }

    mostrarDanoFlotante(x, y, cantidad, esCritico) {
        let txt = this.add.text(x, y, esCritico ? 'CRITICO -' + cantidad + '!' : '-' + cantidad, this.estiloTextoBonito(esCritico ? '24px' : '20px', esCritico ? '#ffcc00' : '#ffffff', esCritico ? '#662200' : '#000000', 5)).setOrigin(0.5).setDepth(250);
        this.tweens.add({ targets: txt, y: y - 50, alpha: 0, scale: 1.2, duration: 800, onComplete: () => txt.destroy() });
    }

    crearExplosionParticulas(x, y, cantidad, esJefe = false) {
        for(let i = 0; i < cantidad; i++) {
            let estrella = this.add.circle(x, y, Phaser.Math.Between(4, 8), esJefe ? 0xff4400 : 0xffffaa).setDepth(150);
            this.physics.add.existing(estrella); 
            estrella.body.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-300, -50));
            this.tweens.add({targets: estrella, alpha: 0, scale: 0.5, duration: 900, onComplete: () => estrella.destroy()});
        }
    }

    aplicarRetrocesoEnemigo(enemigo, jugador) {
        if (enemigo.esJefe) { this.time.delayedCall(400, () => { if (enemigo && enemigo.active) enemigo.inmuneGolpe = false; }); return; }
        enemigo.enRetroceso = true; 
        enemigo.setVelocity(jugador.x < enemigo.x ? 180 : -180, -220); 
        this.time.delayedCall(450, () => { if (enemigo && enemigo.active) { enemigo.enRetroceso = false; enemigo.inmuneGolpe = false; } });
    }

    actualizarMiniBarraEnemigo(enemigo) {
        if (!enemigo.barraVisual) return; 
        enemigo.barraVisual.clear();
        if (enemigo.vidas > 0 && enemigo.vidas < enemigo.maxVidas) {
            enemigo.barraVisual.fillStyle(0x000000, 0.8); enemigo.barraVisual.fillRect(-20, -40, 40, 6);
            enemigo.barraVisual.fillStyle(0x44ff88, 1); enemigo.barraVisual.fillRect(-19, -39, 38 * (enemigo.vidas / enemigo.maxVidas), 4);
        }
    }

    crearBarraJefeVisual(maxVidas) {
        this.jefeMaxVidas = maxVidas;
        this.add.text(400, 25, 'REY DEL VOLCAN', this.estiloTextoBonito('22px', '#ffcc00', '#2b0000', 5)).setOrigin(0.5, 0).setScrollFactor(0).setDepth(202);
        this.barraJefeFondo = this.add.rectangle(400, 65, 410, 24, 0x000000, 0.85).setScrollFactor(0).setDepth(200); 
        this.barraJefeFondo.setStrokeStyle(4, 0x442222);
        this.barraJefeRelleno = this.add.rectangle(195, 65, 400, 16, 0xff2222).setOrigin(0, 0.5).setScrollFactor(0).setDepth(201);
    }

    actualizarBarraJefe(vidasActuales) {
        if (!this.barraJefeRelleno) return;
        this.tweens.add({ targets: this.barraJefeRelleno, width: 400 * Math.max(vidasActuales / this.jefeMaxVidas, 0), duration: 250, ease: 'Power2' });
    }

    crearCorazonItem(x, y, tipo = 'verde') {
        let aura = this.add.circle(x, y, 18, tipo === 'verde' ? 0x44ff88 : 0xff4466, 0.85).setDepth(40); 
        aura.setStrokeStyle(3, 0xffffff);
        let txt = this.add.text(x, y, tipo === 'verde' ? '+S' : '+1', { fontSize: '16px', color: '#000000', fontStyle: 'bold' }).setOrigin(0.5).setDepth(41);
        let zona = this.add.rectangle(x, y, 42, 42, 0x000000, 0);
        this.physics.add.existing(zona); 
        zona.body.setAllowGravity(false); 
        zona.tipoItem = tipo; 
        zona.auraVisual = aura; 
        zona.textoVisual = txt; 
        this.itemsAmor.add(zona);
        this.tweens.add({ targets: [aura, zona, txt], y: y - 14, duration: 650, yoyo: true, repeat: -1 });
    }

    activarModoSuperPinguino() {
        this.modoSuperPinguino = true; 
        if (this.vidas < 3) { this.vidas++; this.actualizarTextoVidas(); }
        this.textoSuper.setVisible(true); 
        this.mostrarAvisoFlotante(this.player.x, this.player.y - 45, 'SUPER PINGUINO!', '#44ff88');
        
        if (this.timerSuper) this.timerSuper.remove();
        this.tweenSuper = this.tweens.add({ targets: this.player, tint: { from: 0x55ff99, to: 0xffff66 }, duration: 180, yoyo: true, repeat: -1 });
        this.timerSuper = this.time.delayedCall(7000, () => { 
            this.modoSuperPinguino = false; 
            this.textoSuper.setVisible(false); 
            if (this.tweenSuper) this.tweenSuper.stop(); 
            this.player.clearTint(); 
        });
    }

    mostrarAvisoFlotante(x, y, mensaje, colorHex) {
        let txt = this.add.text(x, y, mensaje, this.estiloTextoBonito('20px', colorHex, '#000000', 4)).setOrigin(0.5).setDepth(200);
        this.tweens.add({ targets: txt, y: y - 50, alpha: 0, duration: 1150, onComplete: () => txt.destroy() });
    }

    crearChispitaNieve(x, y) {
        if (this.time.now - this.ultimoRastroNieve < 55) return;
        this.ultimoRastroNieve = this.time.now;
        let chispa = this.add.circle(x, y, Phaser.Math.Between(3, 6), this.modoSuperPinguino ? 0x55ff99 : 0xffffff, 0.85).setDepth(48);
        this.tweens.add({ targets: chispa, x: x + (this.player.flipX ? 20 : -20), y: y - Phaser.Math.Between(5, 18), alpha: 0, scale: 0.2, duration: 300, onComplete: () => chispa.destroy() });
    }

    crearTramoPiso(xInicio, xFin, y = 565, tintePiso = null) {
        let anchoTotal = xFin - xInicio, centroX = xInicio + (anchoTotal / 2);
        if (this.textures.exists('piso-hielo')) {
            let pisoSprite = this.suelos.create(centroX, y, 'piso-hielo'); 
            pisoSprite.setDisplaySize(anchoTotal, 80);
            if (tintePiso) pisoSprite.setTint(tintePiso); 
            pisoSprite.refreshBody(); 
            pisoSprite.body.setSize(anchoTotal, 45); 
            pisoSprite.body.setOffset(0, 35);
        } else {
            let rect = this.add.rectangle(centroX, y + 10, anchoTotal, 50, tintePiso || 0x88ccff);
            this.physics.add.existing(rect, true); 
            this.suelos.add(rect);
        }
    }

    crearPlataformaSegura(x, y, clave, tinte = null) {
        if (this.textures.exists(clave)) {
            let plat = this.plataformas.create(x, y, clave); 
            plat.setScale(0.45); 
            if (tinte) plat.setTint(tinte); 
            plat.refreshBody();
            let nuevoAlto = plat.body.height * 0.42, nuevoAncho = plat.body.width * 0.82;
            plat.body.setSize(nuevoAncho, nuevoAlto); 
            plat.body.setOffset((plat.body.width - nuevoAncho) / 2, plat.body.height - nuevoAlto);
        } else {
            let fallback = this.add.rectangle(x, y, 90, 25, 0x88ccff); 
            this.physics.add.existing(fallback, true); 
            this.plataformas.add(fallback);
        }
    }

    crearPlataformaQueCae(x, y, clave) {
        if (this.textures.exists(clave)) {
            let plat = this.plataformasQueCaen.create(x, y, clave); 
            plat.setScale(0.45); 
            plat.setTint(0xffbb88);
            let nuevoAlto = plat.height * 0.42, nuevoAncho = plat.width * 0.82;
            plat.body.setSize(nuevoAncho, nuevoAlto); 
            plat.body.setOffset((plat.width - nuevoAncho) / 2, plat.height - nuevoAlto); 
            plat.cayendo = false;
        }
    }

    crearRampaDiagonal(centroX, centroY = 465, tinte = null) {
        if (this.textures.exists('rampa-larga')) {
            let imgRampa = this.add.image(centroX, centroY, 'rampa-larga'); 
            imgRampa.setScale(0.45); 
            if (tinte) imgRampa.setTint(tinte);
            
            let anchoRampa = imgRampa.displayWidth;
            let altoRampa = imgRampa.displayHeight;
            let inicioX = centroX - (anchoRampa / 2);
            let arribaY = centroY - (altoRampa / 2) + 45;
            let abajoY = centroY + (altoRampa / 2) + 5;
            let pasos = 25;
            let anchoPaso = anchoRampa / pasos;
            
            for (let i = 0; i < pasos; i++) {
                let progreso = i / pasos;
                let xEscalon = inicioX + (i * anchoPaso) + (anchoPaso / 2);
                let yEscalon = arribaY + (progreso * (abajoY - arribaY));
                let escalon = this.add.rectangle(xEscalon, yEscalon, anchoPaso + 4, 16, 0x000000, 0);
                this.physics.add.existing(escalon, true); 
                this.escalonesRampa.add(escalon);
            }
        }
    }

    crearEnemigoUnico(x, y, velocidad) {
        let malito = this.enemigos.create(x, y, 'enemigo-1'); 
        malito.setDisplaySize(110, 110); 
        malito.body.setGravityY(600); 
        malito.setCollideWorldBounds(true);
        
        let bw = malito.width * 0.60;
        let bh = malito.height * 0.75; 
        malito.body.setSize(bw, bh); 
        malito.body.setOffset((malito.width - bw) / 2, malito.height - bh);
        
        malito.velocidadBase = velocidad; 
        malito.claveMuerta = 'enemigo-muerto'; 
        malito.esJefe = false; 
        malito.maxVidas = 2; 
        malito.vidas = 2; 
        malito.enRetroceso = false; 
        malito.inmuneGolpe = false; 
        malito.setVelocityX(velocidad);
        malito.barraVisual = this.add.graphics().setDepth(200);
    }

    matarEnemigoConEstilo(enemigo) {
        enemigo.estaMuerto = true; 
        enemigo.setVelocity(0, 0); 
        enemigo.body.enable = false; 
        if (enemigo.barraVisual) enemigo.barraVisual.destroy();
        
        this.crearExplosionParticulas(enemigo.x, enemigo.y, enemigo.esJefe ? 25 : 8, enemigo.esJefe);
        let tamanoMuerto = enemigo.esJefe ? this.TAMANO_JEFE : 110;
        
        if (this.textures.exists(enemigo.claveMuerta)) { 
            enemigo.setTexture(enemigo.claveMuerta); 
            enemigo.setDisplaySize(tamanoMuerto, tamanoMuerto); 
        } else { 
            enemigo.setFlipY(true); 
        }

        if (enemigo.esJefe) {
            this.jefeDerrotado = true; 
            this.cameras.main.shake(400, 0.015); 
            this.mostrarAvisoFlotante(enemigo.x, enemigo.y - 120, 'EL CAMINO ESTA LIBRE!', '#55ff99');
        }
        this.tweens.add({ targets: enemigo, alpha: 0, y: enemigo.y - 25, duration: 850, onComplete: () => enemigo.destroy() });
    }

    pasarSiguienteNivel(claveSiguienteEscena, tituloCartel, subtituloCartel) {
        this.nivelTerminado = true; 
        this.player.setVelocity(0, 0); 
        this.player.stop(); 
        this.player.setAngle(0); 
        this.forzarTamanoPinguino(false);
        
        let cartel = this.add.container(400, 300).setScrollFactor(0).setDepth(300);
        let fondo = this.add.rectangle(0, 0, 520, 230, 0x1a365d, 0.94); 
        fondo.setStrokeStyle(6, 0x88ccff);
        let t1 = this.add.text(0, -35, tituloCartel, this.estiloTextoBonito('26px', '#ffffff', '#0d1f33', 5)).setOrigin(0.5);
        let t2 = this.add.text(0, 30, subtituloCartel, this.estiloTextoBonito('19px', '#88ccff', '#0d1f33', 4)).setOrigin(0.5);
        
        cartel.add([fondo, t1, t2]);
        this.time.delayedCall(2400, () => this.scene.start(claveSiguienteEscena));
    }

    forzarTamanoPinguino(enBarriga = false) {
        if (!this.player || !this.player.body) return; 
        this.enEstadoPancita = enBarriga;
        this.player.setDisplaySize(enBarriga ? this.ANCHO_PIN * 1.2 : this.ANCHO_PIN, enBarriga ? this.ALTO_PIN * 0.65 : this.ALTO_PIN);
        if (this.estaAtacando) return;
        
        let bw = this.player.width * (enBarriga ? 0.65 : 0.50);
        let bh = this.player.height * (enBarriga ? 0.45 : 0.65);
        let recorteAbajo = this.player.height * this.HUNDIR_PIES;
        
        this.player.body.setSize(bw, bh); 
        this.player.body.setOffset((this.player.width - bw) / 2, this.player.height - bh - recorteAbajo);
    }

    crearControlesIphone() {
        this.touchIzq = false; this.touchDer = false; this.touchArriba = false; this.touchAbajo = false; this.touchAtaque = false;
        const hacerBoton = (x, y, icono, colorFondo, alPresionar, alSoltar) => {
            let circulo = this.add.circle(x, y, 34, colorFondo, 0.58).setScrollFactor(0).setDepth(200).setInteractive();
            circulo.setStrokeStyle(3, 0xffffff, 0.85); 
            this.add.text(x, y, icono, { fontSize: '26px', fontFamily: 'Arial' }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
            circulo.on('pointerdown', () => { circulo.setScale(0.9); circulo.setAlpha(0.85); alPresionar(); });
            const soltar = () => { circulo.setScale(1); circulo.setAlpha(0.58); alSoltar(); };
            circulo.on('pointerup', soltar); 
            circulo.on('pointerout', soltar);
        };
        hacerBoton(65, 525, '<', 0x1a365d, () => this.touchIzq = true, () => this.touchIzq = false);
        hacerBoton(150, 525, '>', 0x1a365d, () => this.touchDer = true, () => this.touchDer = false);
        hacerBoton(235, 525, 'v', 0x2b6cb0, () => this.touchAbajo = true, () => this.touchAbajo = false);
        hacerBoton(620, 525, 'A', 0xe53e3e, () => this.touchAtaque = true, () => this.touchAtaque = false);
        hacerBoton(735, 485, '^', 0x38a169, () => this.touchArriba = true, () => this.touchArriba = false);
    }

    updateBase() {
        if (this.nivelTerminado || this.estaGolpeado || this.estaAtacando) return;
        
        // GUARDADO EN VOLCAN
        if (this.esNivelVolcan && this.player.x > 1850 && !this.guardadoActivo) {
            this.guardadoActivo = true; 
            this.puntoGuardadoX = 1950;
            this.mostrarAvisoFlotante(this.player.x, this.player.y - 70, 'PUNTO GUARDADO!', '#55ff99');
        }

        if (this.player.y > 660) {
            this.vidas--; 
            this.actualizarTextoVidas();
            if (this.vidas <= 0) { 
                this.scene.restart(); return; 
            } else { 
                this.player.setPosition(this.puntoGuardadoX, 420); 
                this.player.setVelocity(0, 0); 
                this.player.setAngle(0); 
                if (this.esNivelVolcan && this.puntoGuardadoX < 1800) this.restaurarBloquesCaidos(); 
            }
        }

        let tocandoSuelo = this.player.body.touching.down || this.player.body.blocked.down;
        let deslizandoEnRampa = (this.time.now - this.ultimoContactoRampa) < 160;

        this.enemigos.children.iterate((enemigo) => {
            if (!enemigo || !enemigo.body || enemigo.estaMuerto) return;
            if (enemigo.y > 650 || enemigo.x < this.cameras.main.scrollX - 200) { 
                if (enemigo.barraVisual) enemigo.barraVisual.destroy(); 
                enemigo.destroy(); return; 
            }
            if (enemigo.barraVisual && enemigo.vidas > 0 && enemigo.vidas < enemigo.maxVidas) {
                enemigo.barraVisual.setPosition(enemigo.x, enemigo.y);
            }
            if (enemigo.enRetroceso) return;

            if (enemigo.esJefe) {
                if (enemigo.x <= enemigo.minX) { enemigo.setVelocityX(enemigo.velocidadPatrulla); enemigo.setFlipX(true); }
                else if (enemigo.x >= enemigo.maxX) { enemigo.setVelocityX(-enemigo.velocidadPatrulla); enemigo.setFlipX(false); }
            } else {
                if (enemigo.body.blocked.left || enemigo.body.touching.left) { 
                    enemigo.velocidadBase = Math.abs(enemigo.velocidadBase); enemigo.setFlipX(true); 
                } else if (enemigo.body.blocked.right || enemigo.body.touching.right) { 
                    enemigo.velocidadBase = -Math.abs(enemigo.velocidadBase); enemigo.setFlipX(false); 
                }
                enemigo.setVelocityX(enemigo.velocidadBase);
            }
        });

        let irIzquierda = this.cursors.left.isDown || this.touchIzq;
        let irDerecha = this.cursors.right.isDown || this.touchDer;
        let irAbajo = this.cursors.down.isDown || this.touchAbajo;
        let irArriba = this.cursors.up.isDown || this.touchArriba;
        let quiereAtacarNormal = Phaser.Input.Keyboard.JustDown(this.keyA) || this.touchAtaque;
        let factorSuper = this.modoSuperPinguino ? 1.25 : 1;

        if (quiereAtacarNormal) { 
            this.touchAtaque = false; 
            this.player.setAngle(0); 
            this.ejecutarAtaqueAnimado(); 
            return; 
        }

        if ((irAbajo && tocandoSuelo) || (deslizandoEnRampa && !irIzquierda)) {
            if (this.player.anims.isPlaying) this.player.anims.stop(); 
            this.player.setTexture('pin-barriga'); 
            this.forzarTamanoPinguino(true);
            
            if (deslizandoEnRampa) { 
                this.player.setFlipX(false); this.player.setAngle(16); this.player.setVelocityX(360 * factorSuper); 
                this.crearChispitaNieve(this.player.x - 15, this.player.y + 15); 
            } else {
                this.player.setAngle(0);
                if (irIzquierda) { 
                    this.player.setVelocityX(-285 * factorSuper); this.player.setFlipX(true); 
                    this.crearChispitaNieve(this.player.x + 15, this.player.y + 18); 
                } else if (irDerecha) { 
                    this.player.setVelocityX(285 * factorSuper); this.player.setFlipX(false); 
                    this.crearChispitaNieve(this.player.x - 15, this.player.y + 18); 
                } else { 
                    this.player.setVelocityX(this.player.body.velocity.x * 0.85); 
                }
            }
            if (irArriba && (tocandoSuelo || deslizandoEnRampa)) { 
                this.ultimoContactoRampa = 0; this.player.setAngle(0); this.player.setVelocityY(-600); 
            }
        } else {
            this.player.setAngle(0); 
            let moviendose = false;
            
            if (irIzquierda) { 
                this.player.setVelocityX(-225 * factorSuper); this.player.setFlipX(true); moviendose = true; 
            } else if (irDerecha) { 
                this.player.setVelocityX(225 * factorSuper); this.player.setFlipX(false); moviendose = true; 
            } else { 
                this.player.setVelocityX(0); 
            }
            
            if (this.modoSuperPinguino && moviendose) this.crearChispitaNieve(this.player.x, this.player.y + 15);
            
            if (!tocandoSuelo) {
                if (this.player.anims.isPlaying) this.player.anims.stop(); 
                this.player.setTexture(this.player.body.velocity.y < 0 ? 'pin-salt' : 'pin-caida'); 
                this.forzarTamanoPinguino(false);
            } else {
                if (moviendose) {
                    if (this.anims.exists('caminar')) { 
                        this.enEstadoPancita = false; 
                        this.player.anims.play('caminar', true); 
                        this.forzarTamanoPinguino(false); 
                    } else { 
                        this.player.setTexture('pin-parado'); this.forzarTamanoPinguino(false); 
                    }
                } else { 
                    if (this.player.anims.isPlaying) this.player.anims.stop(); 
                    this.player.setTexture('pin-parado'); 
                    this.forzarTamanoPinguino(false); 
                }
            }
            if (irArriba && tocandoSuelo) {
                this.player.setVelocityY(-595 * (this.modoSuperPinguino ? 1.08 : 1));
            }
        }
    }

    ejecutarAtaqueAnimado() {
        this.estaAtacando = true; this.enEstadoPancita = false; this.player.setVelocityX(0);
        if (this.anims.exists('atacar')) { 
            this.player.anims.play('atacar', true); 
            this.forzarTamanoPinguino(false); 
            this.player.once('animationcomplete', () => this.estaAtacando = false); 
        } else { 
            this.player.setTexture('pin-ataque-1'); 
            this.forzarTamanoPinguino(false); 
            this.time.delayedCall(300, () => this.estaAtacando = false); 
        }
    }

    recibirDano() {
        this.vidas--; 
        this.actualizarTextoVidas();
        if (this.esNivelVolcan && this.vidas === 1 && !this.corazonEmergenciaLanzado && !this.jefeDerrotado) {
            this.corazonEmergenciaLanzado = true; 
            this.crearCorazonItem(this.puntoGuardadoX + 300, 460, 'rojo'); 
            this.mostrarAvisoFlotante(this.player.x, this.player.y - 60, 'AYUDA EN LA ARENA!', '#ff6688');
        }
        if (this.vidas <= 0) {
            this.estaGolpeado = true; this.player.setVelocity(0, 0); 
            if (this.player.anims.isPlaying) this.player.anims.stop();
            this.player.setTexture('pin-golpeado'); this.forzarTamanoPinguino(false); 
            this.time.delayedCall(1500, () => this.scene.restart()); 
            return;
        }
        this.estaGolpeado = true; 
        if (this.player.anims.isPlaying) this.player.anims.stop(); 
        this.player.setTexture('pin-golpeado'); 
        this.forzarTamanoPinguino(false);
        
        let dir = this.player.flipX ? 200 : -200; 
        this.player.setVelocity(dir, -250);
        this.time.delayedCall(400, () => { this.estaGolpeado = false; this.activarInmunidad(); });
    }

    activarInmunidad() {
        this.esInvencible = true;
        this.tweens.add({ targets: this.player, alpha: 0.2, duration: 100, yoyo: true, repeat: 10, onComplete: () => { this.player.alpha = 1; this.esInvencible = false; } });
    }

    actualizarTextoVidas() { 
        this.textoVidas.setText('VIDAS: ' + this.vidas); 
    }
}

// ==========================================
// 3. MUNDOS 1 Y 2
// ==========================================
class Nivel1 extends NivelBase {
    constructor() { super('Nivel1'); }
    preload() { this.preloadComun(); }
    create() {
        this.iniciarMundoBase(3200, 'fondo-inicio', 'MUNDO 1: VALLE HELADO');
        this.crearTramoPiso(0, 480); this.crearTramoPiso(1250, 2000); this.crearTramoPiso(2550, 3200);
        this.crearPlataformaSegura(640, 450, 'bloque-m'); this.crearPlataformaSegura(860, 380, 'bloque-p'); this.crearPlataformaSegura(1080, 320, 'bloque-p');
        this.crearPlataformaSegura(2150, 440, 'bloque-m'); this.crearPlataformaSegura(2380, 350, 'bloque-p');
        this.crearRampaDiagonal(2800, 465); this.crearCorazonItem(1080, 240, 'verde');
    }
    update() {
        this.updateBase();
        if (!this.nivelTerminado && this.player.x > 3020) this.pasarSiguienteNivel('Nivel2', 'MUNDO 1 SUPERADO!', 'Avanzando hacia la Noche Polar...');
    }
}

class Nivel2 extends NivelBase {
    constructor() { super('Nivel2'); }
    preload() { this.preloadComun(); }
    create() {
        this.iniciarMundoBase(3400, 'fondo-mitad', 'MUNDO 2: NOCHE POLAR');
        this.crearTramoPiso(0, 420); this.crearTramoPiso(1350, 2250); this.crearTramoPiso(2750, 3400);
        this.crearPlataformaSegura(580, 450, 'bloque-p'); this.crearPlataformaSegura(780, 370, 'bloque-p'); this.crearPlataformaSegura(980, 290, 'bloque-m'); this.crearPlataformaSegura(1180, 370, 'bloque-p');
        this.crearPlataformaSegura(2400, 430, 'bloque-p'); this.crearPlataformaSegura(2600, 340, 'bloque-m');
        this.crearRampaDiagonal(3000, 465); this.crearCorazonItem(980, 210, 'verde'); this.crearCorazonItem(2600, 260, 'rojo');
    }
    update() {
        this.updateBase();
        if (!this.nivelTerminado && this.player.x > 3220) this.pasarSiguienteNivel('Nivel3', 'ENTRANDO AL VOLCAN!', 'Enfrentate al Rey del Volcan!');
    }
}

// ==========================================
// 4. MUNDO 3: EL VOLCAN
// ==========================================
class Nivel3 extends NivelBase {
    constructor() { super('Nivel3'); }
    preload() { this.preloadComun(); }
    create() {
        this.esNivelVolcan = true;
        this.iniciarMundoBase(3600, 'fondo-final', 'MUNDO FINAL: EL VOLCAN');

        let lava = this.add.rectangle(1800, 585, 3600, 45, 0xff3300).setDepth(20);
        let brilloLava = this.add.rectangle(1800, 570, 3600, 12, 0xffcc00).setDepth(21);
        this.tweens.add({ targets: [lava, brilloLava], y: '+=8', duration: 600, yoyo: true, repeat: -1 });

        this.crearTramoPiso(0, 450, 565, 0x8b2500); 
        this.crearTramoPiso(1920, 2900, 565, 0x8b2500); 
        this.crearTramoPiso(2900, 3600, 565, 0x8b2500);

        let aviso = this.add.text(400, 130, 'CUIDADO CON LA LAVA!', this.estiloTextoBonito('23px', '#ffff00', '#330000', 6)).setOrigin(0.5).setScrollFactor(0).setDepth(150);
        this.time.delayedCall(4000, () => aviso.destroy());

        this.posicionesBloquesEscape = [{ x: 550, y: 460, tipo: 'bloque-m' }, { x: 780, y: 410, tipo: 'bloque-p' }, { x: 1010, y: 360, tipo: 'bloque-p' }, { x: 1240, y: 410, tipo: 'bloque-m' }, { x: 1470, y: 350, tipo: 'bloque-p' }, { x: 1700, y: 300, tipo: 'bloque-p' }];
        this.restaurarBloquesCaidos(); 
        this.crearRampaDiagonal(2120, 465, 0xffaa88); 
        this.crearCorazonItem(2290, 480, 'verde');

        let texJefe = this.textures.exists('jefe-normal') ? 'jefe-normal' : 'enemigo-1';
        this.jefe = this.enemigos.create(2300, 390, texJefe); 
        this.jefe.setDisplaySize(this.TAMANO_JEFE, this.TAMANO_JEFE); 
        this.jefe.body.setGravityY(600); 
        this.jefe.setCollideWorldBounds(true);
        
        let jw = this.jefe.width * 0.58, jh = this.jefe.height * 0.68; 
        this.jefe.body.setSize(jw, jh); 
        this.jefe.body.setOffset((this.jefe.width - jw) / 2, this.jefe.height * 0.14);
        
        this.jefe.minX = 2000; this.jefe.maxX = 2600; this.jefe.velocidadPatrulla = 140; 
        this.jefe.claveMuerta = this.textures.exists('jefe-muerto') ? 'jefe-muerto' : 'enemigo-muerto'; 
        this.jefe.esJefe = true; this.jefe.vidas = 12; this.jefe.inmuneGolpe = false; 
        this.jefe.setVelocityX(-140); this.jefeDerrotado = false;

        this.crearBarraJefeVisual(12);
    }

    restaurarBloquesCaidos() {
        this.plataformasQueCaen.clear(true, true);
        this.posicionesBloquesEscape.forEach((b) => this.crearPlataformaQueCae(b.x, b.y, b.tipo));
    }

    update() {
        this.updateBase();
        if (!this.jefeDerrotado && this.player.x > 2920) this.player.x = 2920;
        if (this.jefeDerrotado && this.player.x > 3400 && !this.nivelTerminado) {
            this.pasarSiguienteNivel('EscenaFinal', 'EL FINAL DEL CAMINO!', 'Tu patita te espera...');
        }
    }
}

// ==========================================
// 5. ESCENA FINAL
// ==========================================
class EscenaFinal extends NivelBase {
    constructor() { super('EscenaFinal'); }
    
    preload() { this.preloadComun(); }
    
    create() {
        this.iniciarMundoBase(800, 'fondo-final', 'EL REENCUENTRO');
        this.crearTramoPiso(0, 800, 565, 0xffffff);

        // 🦆 Patita al tamaño pedido (85x85)
        this.novia = this.physics.add.sprite(750, 450, 'pat-feliz');
        this.novia.setDisplaySize(85, 85); 
        this.novia.setFlipX(false); 
        this.novia.body.setGravityY(800);
        
        // 🛠️ REPARACIÓN ANTIVUELO: Ajustamos la caja de físicas para ignorar el espacio transparente
        let anchoPatita = this.novia.width * 0.5;
        let altoPatita = this.novia.height * 0.5; 
        this.novia.body.setSize(anchoPatita, altoPatita);
        // Le restamos un extra (0.18) para subir el hitbox y empujar a la patita visualmente hacia ABAJO
        this.novia.body.setOffset((this.novia.width - anchoPatita) / 2, (this.novia.height - altoPatita) - (this.novia.height * 0.18));

        this.physics.add.collider(this.novia, this.suelos);

        this.estadoCinematica = 0; 
        
        this.eventoCorrer = this.time.addEvent({
            delay: 100,
            callback: () => {
                if (this.player.x > 300 && this.estadoCinematica === 0) {
                    this.iniciarCarreraPatita();
                }
            },
            loop: true
        });
    }

    iniciarCarreraPatita() {
        this.estadoCinematica = 1;
        this.nivelTerminado = true; 
        
        this.player.setVelocity(0, 0); 
        if (this.player.anims.isPlaying) this.player.anims.stop(); 
        this.player.setTexture('pin-parado'); 
        this.forzarTamanoPinguino(false);
        this.player.setFlipX(false);

        this.novia.setVelocityX(-180);
        this.novia.setFlipX(false);
        this.novia.setTexture('pat-caminando2'); // Unico frame de caminar
        
        this.time.addEvent({
            delay: 20,
            callback: () => {
                if (this.novia.x <= this.player.x + 85 && this.estadoCinematica === 1) {
                    this.novia.setVelocityX(0);
                    this.novia.setTexture('pat-feliz');
                    this.iniciarTravesuraMagica();
                }
            },
            loop: true
        });
    }

    iniciarTravesuraMagica() {
        this.estadoCinematica = 2; 

        this.time.delayedCall(1200, () => {
            this.novia.setTexture('pat-magia1');
            
            this.time.delayedCall(1000, () => {
                // Se asusta
                this.player.setTexture('pin-asustado'); 
                this.forzarTamanoPinguino(false); 
                this.novia.setTexture('pat-magia2');
                
                this.time.delayedCall(600, () => {
                    this.novia.setTexture('pat-magia3');
                    
                    this.cameras.main.flash(1000, 255, 200, 255); 
                    this.cameras.main.shake(1200, 0.04);
                    
                    let imgExplosion = this.add.image(this.novia.x - 45, this.novia.y - 45, 'explosion');
                    imgExplosion.setScale(0.1);
                    imgExplosion.setDepth(9999); 
                    this.player.setDepth(50); 
                    this.novia.setDepth(50);
                    this.tweens.add({ targets: imgExplosion, scale: 1.5, alpha: 0, duration: 800, onComplete: () => imgExplosion.destroy() });

                    this.time.delayedCall(400, () => {
                        // Queda chamuscado
                        this.player.setTexture('pin-expl'); 
                        this.forzarTamanoPinguino(false); 
                        this.novia.setTexture('pat-regalo'); 
                        
                        this.time.delayedCall(1500, () => {
                            // Hace berrinche/se enoja
                            this.player.setTexture('pin-eno'); 
                            this.forzarTamanoPinguino(false); 
                            
                            this.time.delayedCall(1200, () => {
                                // Se le pasa y ve el regalo
                                this.player.setTexture('pin-reg'); 
                                this.forzarTamanoPinguino(false); 
                                this.mostrarBotonRegalo();
                            });
                        });
                    });
                });
            });
        });
    }

    mostrarBotonRegalo() {
        let btnRegalo = this.add.text(400, 150, 'ABRIR REGALO', {
            fontFamily: "'Fredoka', sans-serif", fontSize: '22px', fontStyle: 'bold',
            color: '#ffffff', backgroundColor: '#ff6688', padding: { x: 25, y: 12 },
            shadow: { offsetX: 0, offsetY: 3, color: 'rgba(0,0,0,0.5)', fill: true }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(300);
        
        this.tweens.add({ targets: btnRegalo, scale: 1.05, duration: 600, yoyo: true, repeat: -1 });
        btnRegalo.on('pointerdown', () => this.scene.start('ScrapbookScene'));
    }

    update() {
        this.updateBase();
        if (this.player.x > 750) this.player.x = 750;
    }
}

// ==========================================
// 6. ESCENA DEL SCRAPBOOK (DESLIZABLE)
// ==========================================
class ScrapbookScene extends Phaser.Scene {
    constructor() { super('ScrapbookScene'); }

    preload() {
        this.load.image('pin-parado', 'pa.png'); 
        this.load.image('pat-feliz', 'pat-feliz.png');
    }

    create() {
        const ancho = this.scale.width, alto = this.scale.height;
        this.add.rectangle(0, 0, ancho, alto, 0x111118, 1).setOrigin(0, 0);

        let libroFondo = this.add.graphics();
        libroFondo.fillStyle(0x000000, 0.4); 
        libroFondo.fillRoundedRect(ancho/2 - 340, alto/2 - 210, 680, 420, 16);
        libroFondo.fillStyle(0xfff5f0, 1); 
        libroFondo.fillRoundedRect(ancho/2 - 350, alto/2 - 220, 700, 430, 16);
        libroFondo.lineStyle(4, 0xe2d0c4); 
        libroFondo.strokeRoundedRect(ancho/2 - 350, alto/2 - 220, 700, 430, 16);

        this.add.text(ancho/2, 50, 'UNA CARTA DESDE MI CORAZON', { 
            fontFamily: "'Fredoka', sans-serif", fontSize: '22px', color: '#b83b5e', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(10);
        
        let btnVolver = this.add.text(ancho/2, 560, 'X Volver al Menu', { 
            fontFamily: "'Fredoka', sans-serif", fontSize: '18px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#3d5a80', padding: { x: 16, y: 8 } 
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(20);
        
        btnVolver.on('pointerdown', () => { 
            btnVolver.setScale(0.95); 
            this.time.delayedCall(100, () => { this.scene.start('MenuScene'); }); 
        });

        let shape = this.make.graphics();
        shape.fillStyle(0xffffff);
        shape.fillRect(ancho/2 - 330, alto/2 - 190, 660, 380);
        let mask = new Phaser.Display.Masks.GeometryMask(this, shape);

        this.contenedorTexto = this.add.container(0, 0);
        this.contenedorTexto.setMask(mask);

        let textoCompleto = `Feliz cumpleanos, mi nino hermoso.\n\nHoy quiero decirte unas palabritas que pueden no ser lo mas lindo, pero si vienen de mi corazon porque este dia no es cualquier dia. Hoy celebramos la existencia de una personita verdaderamente maravillosa, alguien que merece muchisimo mas de lo que a veces puede imaginar.\n\nPara tu yo de antes\nPrimero quiero hablarle a ese ninito que algun dia fuiste, al que seguramente tenia muchos suenos, preguntas e ilusiones... No se como fueron todos tus dias ni todas las cosas que tuviste que vivir para llegar hasta aqui, pero me gustaria poder decirle a ese pequeno Estiven que estoy muy orgullosa de la personita en la que se esta convirtiendo.\n\nMe gustaria decirle que no tenga miedo de equivocarse, que no se preocupe tanto por tener todas las respuestas. Que jamas piense que tiene que ser perfecto para merecer cosas bonitas, porque desde ese entonces ya era una personita valiosa.\n\nPara el Estiven de hoy...\nMi amorcito, hay tantisimas cosas de ti que admiro que a veces ni siquiera se por donde empezar. Admiro tu paciencia, esa forma tan linda de comprender a los demas, tu empatia y la amabilidad con la que tratas a las personas.\n\nPero hay algo que quiero que sepas: no tienes que estar sonriendo siempre, ni tienes que poder con todo. Se que a veces la vida puede ser complicada, por eso quiero recordarte que tambien esta bien descansar, sentirte cansado o simplemente necesitar un poquito de tranquilidad.\n\nTu valor no depende de cuanto logres o de cuantas dificultades superes. Eres valioso simplemente por ser tu, Estiven, y te amo. Estoy muy orgullosa de ti, mi amor. No solamente por lo que has conseguido, sino por todo lo que eres.\n\nPara el Estiven del futuro...\nAy, mi cielo, si supieras todas las cosas bonitas que deseo para ti. Espero que la vida te permita cumplir tus suenos, que nunca pierdas esa empatia ni tu bondad. \n\nPero tambien deseo que aprendas a ponerte a ti mismo entre tus prioridades. Que nunca tengas que cambiar partes de ti para encajar y que siempre encuentres personas que te valoren por quien realmente eres.\n\nY si algun dia las cosas no salen como lo imaginabas, recuerda que eso no significa que hayas fracasado. Aun habra caminos por seguir, pero se que podras, porque tu eres el mejor. No tengas miedo de cambiar, de crecer o de comenzar de nuevo. Siempre mereceras lo mejor.\n\nY para terminar, mi precioso\nGracias por existir, por seguir creciendo y por regalarle al mundo una version tan unica de ti mismo.\n\nFeliz cumpleanos, mi Estiven hermoso. Ojala la vida te regale muchisimos, muchisimos anos para seguir descubriendo lo maravilloso que puede ser vivir... y tal vez a mi lado.\n\nTe amo con todo mi corazon, mi pinguinito.\n\nCon muchisimo amor,\nTu patita.`;
        
        let configTexto = { fontFamily: "'Fredoka', sans-serif", fontSize: '16px', color: '#4a2c40', align: 'left', lineSpacing: 8, wordWrap: { width: 620 } };
        let textoObj = this.add.text(ancho/2 - 310, 120, textoCompleto, configTexto);
        
        this.contenedorTexto.add(textoObj);

        // 🛠️ CHIBIS EN TAMAÑO PERFECTO (55x55 píxeles) Y CON LOS NOMBRES EXACTOS
        let pinChibi = this.add.image(ancho/2 - 40, textoObj.y + textoObj.height + 60, 'pin-parado').setDisplaySize(55, 55);
        let pataChibi = this.add.image(ancho/2 + 40, textoObj.y + textoObj.height + 60, 'pat-feliz').setDisplaySize(55, 55);
        this.contenedorTexto.add([pinChibi, pataChibi]);

        let hitArea = this.add.rectangle(ancho/2, alto/2, 660, 380, 0x000000, 0).setInteractive();
        let dragStartY = 0, containerStartY = 0;

        hitArea.on('pointerdown', (pointer) => { dragStartY = pointer.y; containerStartY = this.contenedorTexto.y; });
        hitArea.on('pointermove', (pointer) => {
            if (!pointer.isDown) return;
            this.contenedorTexto.y = containerStartY + (pointer.y - dragStartY);
            this.limitarScroll(textoObj.height);
        });
        
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            this.contenedorTexto.y -= deltaY * 0.5;
            this.limitarScroll(textoObj.height);
        });

        let btnSube = this.add.text(ancho/2 + 360, 150, '^', { fontFamily: "Arial", fontSize: '24px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#6c757d', padding: { x: 10, y: 5 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        let btnBaja = this.add.text(ancho/2 + 360, 450, 'v', { fontFamily: "Arial", fontSize: '24px', fontStyle: 'bold', color: '#ffffff', backgroundColor: '#6c757d', padding: { x: 10, y: 5 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        
        btnSube.on('pointerdown', () => { this.contenedorTexto.y += 60; this.limitarScroll(textoObj.height); });
        btnBaja.on('pointerdown', () => { this.contenedorTexto.y -= 60; this.limitarScroll(textoObj.height); });
    }

    limitarScroll(alturaTexto) {
        let limiteSuperior = 0;
        let limiteInferior = -(alturaTexto - 150); 
        if (limiteInferior > 0) limiteInferior = 0;

        if (this.contenedorTexto.y > limiteSuperior) this.contenedorTexto.y = limiteSuperior;
        if (this.contenedorTexto.y < limiteInferior) this.contenedorTexto.y = limiteInferior;
    }
}

// ==========================================
// CONFIGURACION FINAL DEL JUEGO
// ==========================================
const config = { 
    type: Phaser.AUTO, 
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 600 }, 
    parent: 'juego-contenedor', 
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } }, 
    scene: [MenuScene, Nivel1, Nivel2, Nivel3, EscenaFinal, ScrapbookScene] 
};
const game = new Phaser.Game(config);
