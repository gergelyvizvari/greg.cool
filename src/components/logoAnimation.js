import React, { useEffect, useRef } from 'react'
import './logoAnimation.css';

const randomDirection = (d) => {
    if (d === 0) {
        const t = Math.round(Math.random() * 10);
        d = (t % 2 === 0) ? 1 : -1;
    }
    const r = d * (Math.round(Math.random() * 5) + 5)
    return r;
}

export default function LogoAnimation() {
    const canvasAnimRef = useRef(null);
    const canvasTextRef = useRef(null);
    const animContainer = useRef(null);

    useEffect(() => {
        const s = { w: 1920, h: 1024 };

        let swarm = [];
        let frozenSwarm = [];

        for (let i = 0; i < 2000; i++) {
            swarm.push({ x: Math.round(Math.random() * s.w), y: Math.round(Math.random() * s.h), dx: randomDirection(0), dy: randomDirection(0), repeat: 0 })
        }

        const animate = (ctxAnim, ctxText) => {

            canvasAnim.width = s.w;
            canvasAnim.height = s.h;
            canvasText.width = s.w;
            canvasText.height = s.h;

            ctxAnim.clearRect(0, 0, s.w, s.h);
            ctxAnim.rect(0, 0, s.w, s.h);
            ctxAnim.fillStyle = '#000000';
            ctxAnim.fill();

            ctxText.font = `bold 400px Arial`;
            ctxText.fillStyle = "rgb(10,0,0)";
            ctxText.textAlign = "center";
            ctxText.fillText("GREG", s.w / 2, s.h / 2 + 150);

            const stickySize = { lg: { x: 20, y: 25 }, sm: { x: 15, y: 15 } };

            frozenSwarm.forEach((m) => {
                ctxAnim.beginPath();
                ctxAnim.fillStyle = "yellow";
                ctxAnim.strokeStle = "black";
                ctxAnim.fillRect(m.x - stickySize.lg.x / 2, m.y - stickySize.lg.y / 2, stickySize.lg.x, stickySize.lg.y);
                ctxAnim.rect(m.x - stickySize.lg.x / 2, m.y - stickySize.lg.y / 2, stickySize.lg.x, stickySize.lg.y);
                ctxAnim.stroke();
                ctxText.fillStyle = "rgb(0,100,0)";
                ctxText.fillRect(m.x - stickySize.sm.x / 2, m.y - stickySize.sm.y / 2, stickySize.sm.x, stickySize.sm.y);
            });

            // draw dots
            const animData = ctxAnim.getImageData(0, 0, s.w, s.h);
            const textData = ctxText.getImageData(0, 0, s.w, s.h);

            // draw followers
            swarm.forEach((m, mInd) => {
                m.x += m.dx;
                m.y += m.dy;

                if (m.x > s.w && m.dx > 0) {
                    m.dx = randomDirection(-1)
                    m.repeat++;
                }

                if (m.x < 0 && m.dx < 0) {
                    m.dx = randomDirection(1)
                    m.repeat++;
                }

                if (m.y > s.h && m.dy > 0) {
                    m.dy = randomDirection(-1)
                    m.repeat++;
                }
                if (m.y < 0 && m.dy < 0) {
                    m.dy = randomDirection(1)
                    m.repeat++;
                }

                const newIndex = (m.x + m.y * s.w) * 4;

                animData.data[newIndex + 0] = 255;
                animData.data[newIndex + 1] = 255;
                animData.data[newIndex + 2] = 255;
                animData.data[newIndex + 3] = 255;

                if (textData.data[newIndex + 0] === 10 && m.repeat > 1) {
                    swarm.splice(mInd, 1);
                    frozenSwarm.push({ x: m.x, y: m.y });
                }
            })

            if (swarm.length > 500) {
                ctxAnim.putImageData(animData, 0, 0);
            }

            if (swarm.length > 500) {
                requestAnimationFrame(() => animate(ctxAnim, ctxText));
            }
        };

        const canvasAnim = canvasAnimRef.current;
        const canvasText = canvasTextRef.current;
        const ctxAnim = canvasAnim.getContext('2d');
        const ctxText = canvasText.getContext('2d');

        requestAnimationFrame(() => animate(ctxAnim, ctxText));

    }, [animContainer])

    useEffect(() => {

    }, [])

    return (
        <div ref={animContainer} className={'Animation__Container'}>
            <canvas ref={canvasTextRef} className={'Animation__Canvas'}></canvas>
            <canvas ref={canvasAnimRef} className={'Animation__Canvas'}></canvas>
        </div>
    )
}
