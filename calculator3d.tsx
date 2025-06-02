'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Calculator3D = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [displayValue, setDisplayValue] = useState('0');
    const [storedValue, setStoredValue] = useState<string | null>(null);
    const [operation, setOperation] = useState<string | null>(null);
    const [waitingForOperand, setWaitingForOperand] = useState(false);
    const [memory, setMemory] = useState(0);
    const [lastClickedButton, setLastClickedButton] = useState<string | null>(null);

    const calculatorStateRef = useRef({
        displayValue,
        handleButtonClick: (buttonValue: string) => { },
        updateDisplay: () => { }
    });

    useEffect(() => {
        calculatorStateRef.current.displayValue = displayValue;
    }, [displayValue]);

    useEffect(() => {
        if (calculatorStateRef.current && calculatorStateRef.current.updateDisplay) {
            calculatorStateRef.current.updateDisplay();
        }
    }, [displayValue]);

    const inputDigit = (digit: string) => {
        if (waitingForOperand) {
            setDisplayValue(digit);
            setWaitingForOperand(false);
        } else {
            setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
        }
    };

    const inputDecimal = () => {
        if (waitingForOperand) {
            setDisplayValue('0.');
            setWaitingForOperand(false);
        } else if (displayValue.indexOf('.') === -1) {
            setDisplayValue(displayValue + '.');
        }
    };

    const clearDisplay = () => {
        setDisplayValue('0');
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    };

    const performOperation = (nextOperation: string) => {
        const inputValue = parseFloat(displayValue);

        if (storedValue === null) {
            setStoredValue(displayValue);
        } else if (operation) {
            const storedValueNum = parseFloat(storedValue);
            let result = 0;

            switch (operation) {
                case '+':
                    result = storedValueNum + inputValue;
                    break;
                case '-':
                    result = storedValueNum - inputValue;
                    break;
                case '×':
                    result = storedValueNum * inputValue;
                    break;
                case '÷':
                    result = inputValue !== 0 ? storedValueNum / inputValue : NaN;
                    break;
                default:
                    return;
            }
            setDisplayValue(String(result));
            setStoredValue(String(result));
        }
        setWaitingForOperand(true);
        setOperation(nextOperation);
    };

    const handleEquals = () => {
        if (storedValue === null || operation === null) {
            return;
        }
        const inputValue = parseFloat(displayValue);
        const storedValueNum = parseFloat(storedValue);
        let result = 0;
        switch (operation) {
            case '+':
                result = storedValueNum + inputValue;
                break;
            case '-':
                result = storedValueNum - inputValue;
                break;
            case '×':
                result = storedValueNum * inputValue;
                break;
            case '÷':
                result = inputValue !== 0 ? storedValueNum / inputValue : NaN;
                break;
            default:
                return;
        }

        setDisplayValue(String(result));
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(true);
    };

    const handleSquareRoot = () => {
        const value = parseFloat(displayValue);
        if (value >= 0) {
            setDisplayValue(String(Math.sqrt(value)));
        } else {
            setDisplayValue('Error');
        }
        setWaitingForOperand(true);
    };

    const handlePercentage = () => {
        const value = parseFloat(displayValue);
        setDisplayValue(String(value / 100));
        setWaitingForOperand(true);
    };

    const handleSignChange = () => {
        const value = parseFloat(displayValue);
        setDisplayValue(String(-value));
    };

    const memoryClear = () => {
        setMemory(0);
        setDisplayValue('0');
        setStoredValue(null);
        setOperation(null);
        setWaitingForOperand(false);
    }

    const memoryRecall = () => {
        if (lastClickedButton === 'MRC') {
            memoryClear();
            setLastClickedButton(null);
        } else {
            setDisplayValue(String(memory));
            setWaitingForOperand(true);
            setLastClickedButton('MRC');
        }
    };

    const memoryAdd = () => setMemory(memory + parseFloat(displayValue));
    const memorySubtract = () => setMemory(memory - parseFloat(displayValue));

    // Handle button clicks
    const handleButtonClick = (buttonValue: string) => {
        if (!(buttonValue === 'MRC' && lastClickedButton === 'MRC')) {
            setLastClickedButton(buttonValue);
        }
        switch (buttonValue) {
            case 'ON/C':
                clearDisplay();
                break;
            case '+/-':
                handleSignChange();
                break;
            case '√':
                handleSquareRoot();
                break;
            case '%':
                handlePercentage();
                break;
            case 'MRC':
                memoryRecall();
                break;
            case 'M-':
                memorySubtract();
                break;
            case 'M+':
                memoryAdd();
                break;
            case '=':
                handleEquals();
                break;
            case '.':
                inputDecimal();
                break;
            case '+':
            case '-':
            case '×':
            case '÷':
                performOperation(buttonValue);
                break;
            default:
                if (/^\d$/.test(buttonValue)) {
                    inputDigit(buttonValue);
                }
        }
    };

    const createSegmentedDisplay = (text: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 256;
        const context = canvas.getContext('2d')!;

        // Background
        context.fillStyle = '#626262';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Segment colors
        const activeColor = '#000000';
        const inactiveColor = '#626262';

        // Segment geometry
        const digitWidth = 80;
        const digitHeight = 140;
        const segmentThickness = 12;
        const segmentLength = 50;
        const margin = 3;
        const spacing = 100;

        // Helper function to draw a single segment
        const drawSegment = (x: number, y: number, horizontal: boolean, active: boolean) => {
            context.fillStyle = active ? activeColor : inactiveColor;

            if (horizontal) {
                context.beginPath();
                context.moveTo(x + segmentThickness / 2, y);
                context.lineTo(x + segmentLength - segmentThickness / 2, y);
                context.lineTo(x + segmentLength, y + segmentThickness / 2);
                context.lineTo(x + segmentLength - segmentThickness / 2, y + segmentThickness);
                context.lineTo(x + segmentThickness / 2, y + segmentThickness);
                context.lineTo(x, y + segmentThickness / 2);
                context.closePath();
            } else {
                context.beginPath();
                context.moveTo(x, y + segmentThickness / 2);
                context.lineTo(x + segmentThickness / 2, y);
                context.lineTo(x + segmentThickness, y + segmentThickness / 2);
                context.lineTo(x + segmentThickness, y + segmentLength - segmentThickness / 2);
                context.lineTo(x + segmentThickness / 2, y + segmentLength);
                context.lineTo(x, y + segmentLength - segmentThickness / 2);
                context.closePath();
            }

            context.fill();
        };

        // Helper function to draw a digit
        const drawDigit = (x: number, y: number, digit: string) => {
            // Define which segments are active for each digit (a-g)
            const segments: Record<string, boolean[]> = {
                '0': [true, true, true, true, true, true, false],
                '1': [false, true, true, false, false, false, false],
                '2': [true, true, false, true, true, false, true],
                '3': [true, true, true, true, false, false, true],
                '4': [false, true, true, false, false, true, true],
                '5': [true, false, true, true, false, true, true],
                '6': [true, false, true, true, true, true, true],
                '7': [true, true, true, false, false, false, false],
                '8': [true, true, true, true, true, true, true],
                '9': [true, true, true, true, false, true, true],
                '.': [false, false, false, false, false, false, false],
                '-': [false, false, false, false, false, false, true],
                'E': [true, false, false, true, true, true, true], // Error
                'r': [false, false, false, false, true, false, true] // For "Error"
            };

            if (digit === '.') {
                context.fillStyle = activeColor;
                context.beginPath();
                context.arc(x + digitWidth - 15, y + digitHeight - 15, 5, 0, Math.PI * 2);
                context.fill();
                return;
            }

            // Get the segment pattern for this digit
            const pattern = segments[digit] || segments['8'];

            // Draw each segment (a-g)
            // Segment a (top)
            drawSegment(x + margin + segmentThickness, y + margin, true, pattern[0]);
            // Segment b (upper right)
            drawSegment(x + digitWidth - margin - segmentThickness, y + margin + segmentThickness, false, pattern[1]);
            // Segment c (lower right)
            drawSegment(x + digitWidth - margin - segmentThickness, y + digitHeight / 2 + margin, false, pattern[2]);
            // Segment d (bottom)
            drawSegment(x + margin + segmentThickness, y + digitHeight - margin - segmentThickness, true, pattern[3]);
            // Segment e (lower left)
            drawSegment(x + margin, y + digitHeight / 2 + margin, false, pattern[4]);
            // Segment f (upper left)
            drawSegment(x + margin, y + margin + segmentThickness, false, pattern[5]);
            // Segment g (middle)
            drawSegment(x + margin + segmentThickness, y + digitHeight / 2, true, pattern[6]);
        };

        // Process the text to display
        let displayText = text;
        if (text.length > 10) {
            displayText = parseFloat(text).toExponential(6);
        }

        // Handle special cases
        if (text === 'Error') {
            displayText = 'Err';
        }

        // Calculate starting position (right-aligned)
        const totalWidth = displayText.length * spacing;
        let startX = canvas.width - 40 - totalWidth;

        // Draw each character
        for (let i = 0; i < displayText.length; i++) {
            const char = displayText[i];
            drawDigit(startX + i * spacing, 50, char);
        }

        return new THREE.CanvasTexture(canvas);
    };

    useEffect(() => {
        calculatorStateRef.current.handleButtonClick = handleButtonClick;
    }, [handleButtonClick]);

    useEffect(() => {
        if (!mountRef.current) return;

        const container = mountRef.current;

        // Prevent duplicate initialization
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        const width = container.clientWidth;
        const height = container.clientHeight;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.shadowMap.enabled = true;
        container.appendChild(renderer.domElement);

        // Resize handler
        const handleResize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // Function for button labels
        const createLabelTexture = (text: string, color = '#000000', size = 200) => {
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            const context = canvas.getContext('2d')!;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = `Bold ${size * 0.4}px Helvetica`;
            context.fillStyle = color;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 3);
            return new THREE.CanvasTexture(canvas);
        };

        const createDisplayTexture = (text: string) => {
            return createSegmentedDisplay(text);
        };

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = null;

        // OrbitControls
        class OrbitControls {
            object: THREE.Camera;
            domElement: HTMLElement;
            enableDamping = true;
            dampingFactor = 0.05;
            minDistance = 7;
            maxDistance = 13;
            enablePan = false;

            private spherical = new THREE.Spherical();
            private sphericalDelta = new THREE.Spherical();
            private scale = 1;
            private zoomChanged = false;
            private rotateStart = new THREE.Vector2();
            private rotateEnd = new THREE.Vector2();
            private rotateDelta = new THREE.Vector2();
            private state = 'NONE';
            private target = new THREE.Vector3();

            constructor(object: THREE.Camera, domElement: HTMLElement) {
                this.object = object;
                this.domElement = domElement;

                const position = this.object.position.clone();
                this.spherical.setFromVector3(position);

                this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
                this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this));
                this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
            }

            private onMouseDown(event: MouseEvent) {
                event.preventDefault();

                if (event.button === 0) {
                    this.state = 'ROTATE';
                    this.rotateStart.set(event.clientX, event.clientY);
                }

                this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
                this.domElement.addEventListener('mouseup', this.onMouseUp.bind(this));
            }

            private onMouseMove(event: MouseEvent) {
                event.preventDefault();

                if (this.state === 'ROTATE') {
                    this.rotateEnd.set(event.clientX, event.clientY);
                    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(0.005);

                    this.sphericalDelta.theta -= this.rotateDelta.x;
                    this.sphericalDelta.phi -= this.rotateDelta.y;

                    this.rotateStart.copy(this.rotateEnd);
                }
            }

            private onMouseUp() {
                this.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
                this.domElement.removeEventListener('mouseup', this.onMouseUp.bind(this));
                this.state = 'NONE';
            }

            private onMouseWheel(event: WheelEvent) {
                event.preventDefault();

                if (event.deltaY < 0) {
                    this.scale /= 0.95;
                } else if (event.deltaY > 0) {
                    this.scale *= 0.95;
                }

                this.zoomChanged = true;
            }

            update() {
                const position = this.object.position;

                this.spherical.setFromVector3(position.clone().sub(this.target));

                if (this.enableDamping) {
                    this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor;
                    this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor;
                    this.sphericalDelta.theta *= (1 - this.dampingFactor);
                    this.sphericalDelta.phi *= (1 - this.dampingFactor);
                } else {
                    this.spherical.theta += this.sphericalDelta.theta;
                    this.spherical.phi += this.sphericalDelta.phi;
                    this.sphericalDelta.set(0, 0, 0);
                }

                this.spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, this.spherical.phi));

                if (this.zoomChanged) {
                    this.spherical.radius *= this.scale;
                    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius));
                    this.scale = 1;
                    this.zoomChanged = false;
                }

                position.setFromSpherical(this.spherical).add(this.target);
                this.object.lookAt(this.target);
            }
        }

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);

        // Function to create rounded boxes
        const createRoundedBox = (width: number, height: number, depth: number, radius: number) => {
            const shape = new THREE.Shape();
            const x = -width / 2, y = -height / 2;
            shape.moveTo(x + radius, y);
            shape.lineTo(x + width - radius, y);
            shape.quadraticCurveTo(x + width, y, x + width, y + radius);
            shape.lineTo(x + width, y + height - radius);
            shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            shape.lineTo(x + radius, y + height);
            shape.quadraticCurveTo(x, y + height, x, y + height - radius);
            shape.lineTo(x, y + radius);
            shape.quadraticCurveTo(x, y, x + radius, y);
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: depth - radius * 2,
                bevelEnabled: true,
                bevelSegments: 4,
                steps: 1,
                bevelSize: radius,
                bevelThickness: radius
            });

            geometry.center();
            return geometry;
        };

        const createCalculator = () => {
            const calculatorGroup = new THREE.Group();
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();

            const bodyGeometry = createRoundedBox(4.3, 7.5, 0.5, 0.04);
            const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x1e88e5 });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;
            body.receiveShadow = true;
            body.position.y = 0;
            body.position.x = 0;
            body.position.z = 0;
            calculatorGroup.add(body);

            const screenGeometry = new THREE.PlaneGeometry(3.8, 0.8);
            const screenMaterial = new THREE.MeshBasicMaterial({
                map: createDisplayTexture(calculatorStateRef.current.displayValue),
                transparent: true,
                opacity: 1,
                side: THREE.DoubleSide
            });

            const screen = new THREE.Mesh(screenGeometry, screenMaterial);
            screen.position.set(0, 3, 0.26);
            calculatorGroup.add(screen);

            const updateDisplay = () => {
                const currentDisplayValue = calculatorStateRef.current.displayValue;
                const newTexture = createDisplayTexture(currentDisplayValue);
                screenMaterial.map?.dispose();
                screenMaterial.map = newTexture;
                screenMaterial.needsUpdate = true;
            };

            calculatorStateRef.current.updateDisplay = updateDisplay;

            // Solar panel
            const solarPanelGeometry = createRoundedBox(1.9, 0.6, 0.5, 0.04);
            const solarPanelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const solarPanel = new THREE.Mesh(solarPanelGeometry, solarPanelMaterial);
            solarPanel.position.set(-1.05, 1.9, 0.03);
            calculatorGroup.add(solarPanel);

            // Solar panel stripes
            for (let i = 0; i < 3; i++) {
                const stripeGeometry = new THREE.BoxGeometry(0.05, 0.61, 0.5);
                const stripeMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
                const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
                stripe.position.set(-1.5 + i * 0.495, 1.9, 0.04);
                calculatorGroup.add(stripe);
            }

            const whiteButtonMaterial = new THREE.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0xffffff,
                shininess: 70
            });

            const redButtonMaterial = new THREE.MeshPhongMaterial({
                color: 0xe53935,
                specular: 0x111111,
                shininess: 70
            });

            // Button labels
            const leftButtonLabels = [
                ['MRC', 'M-', 'M+'],
                ['√', '%', '+/-'],
                ['7', '8', '9'],
                ['4', '5', '6'],
                ['1', '2', '3'],
                ['ON/C', '0', '.']
            ];
            const rightButtonLabels = ['÷', '×', '-', '+', '='];
            const buttons: { mesh: THREE.Mesh; label: THREE.Mesh; value: string }[] = [];

            // Left buttons
            const leftStartX = -1.5;
            const leftStartY = 1.0;
            const leftColSpacing = 0.9;
            const leftRowSpacing = 0.8;

            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 3; col++) {
                    const isRedButton = row < 2 || (row === 5 && col === 0);
                    const material = isRedButton ? redButtonMaterial.clone() : whiteButtonMaterial.clone();
                    const buttonValue = leftButtonLabels[row][col];

                    // Create button
                    const buttonGeometry = createRoundedBox(0.73, 0.5, 0.04, 0.03);
                    const button = new THREE.Mesh(buttonGeometry, material);
                    button.position.set(
                        leftStartX + col * leftColSpacing,
                        leftStartY - row * leftRowSpacing,
                        0.255
                    );
                    button.castShadow = true;
                    calculatorGroup.add(button);

                    // Create label
                    const isNumber = /^[0-9.]$/.test(buttonValue);
                    const labelColor = isNumber ? '#111184' : '#ffffff';
                    const labelTexture = createLabelTexture(buttonValue, labelColor);
                    const labelGeometry = new THREE.PlaneGeometry(0.5, 0.4);
                    const labelMaterial = new THREE.MeshBasicMaterial({
                        map: labelTexture,
                        transparent: true,
                        opacity: 1,
                        depthTest: false
                    });
                    const label = new THREE.Mesh(labelGeometry, labelMaterial);
                    label.position.set(
                        leftStartX + col * leftColSpacing,
                        leftStartY - row * leftRowSpacing,
                        0.275
                    );
                    label.renderOrder = 1;
                    calculatorGroup.add(label);

                    buttons.push({ mesh: button, label, value: buttonValue });
                }
            }

            // Right buttons
            const rightStartX = 1.5;
            const rightStartY = 1.0;
            const rightRowSpacing = 0.8;

            for (let row = 0; row < 4; row++) {
                const buttonValue = rightButtonLabels[row];
                const buttonGeometry = createRoundedBox(0.73, 0.6, 0.04, 0.03);
                const button = new THREE.Mesh(buttonGeometry, redButtonMaterial.clone());
                button.position.set(
                    rightStartX,
                    rightStartY - row * rightRowSpacing,
                    0.255
                );
                button.castShadow = true;
                calculatorGroup.add(button);

                // Create label
                const labelTexture = createLabelTexture(buttonValue, '#ffffff');
                const labelGeometry = new THREE.PlaneGeometry(0.5, 0.4);
                const labelMaterial = new THREE.MeshBasicMaterial({
                    map: labelTexture,
                    transparent: true,
                    depthTest: false
                });
                const label = new THREE.Mesh(labelGeometry, labelMaterial);
                label.position.set(
                    rightStartX,
                    rightStartY - row * rightRowSpacing,
                    0.275
                );
                label.renderOrder = 1;
                calculatorGroup.add(label);

                buttons.push({ mesh: button, label, value: buttonValue });
            }

            // Big equals button
            const equalsButtonValue = '=';
            const equalsButtonGeometry = createRoundedBox(0.73, 1.425, 0.04, 0.03);
            const equalsButton = new THREE.Mesh(equalsButtonGeometry, redButtonMaterial.clone());
            equalsButton.position.set(
                rightStartX,
                rightStartY - 5 * rightRowSpacing + 0.305,
                0.255
            );
            equalsButton.castShadow = true;
            calculatorGroup.add(equalsButton);

            // Create equals label
            const equalsLabelTexture = createLabelTexture(equalsButtonValue, '#ffffff', 256);
            const equalsLabelGeometry = new THREE.PlaneGeometry(0.5, 0.8);
            const equalsLabelMaterial = new THREE.MeshBasicMaterial({
                map: equalsLabelTexture,
                transparent: true,
                depthTest: false
            });
            const equalsLabel = new THREE.Mesh(equalsLabelGeometry, equalsLabelMaterial);
            equalsLabel.position.set(
                rightStartX,
                rightStartY - 5 * rightRowSpacing + 0.305,
                0.275
            );
            equalsLabel.renderOrder = 1;
            calculatorGroup.add(equalsLabel);

            buttons.push({ mesh: equalsButton, label: equalsLabel, value: equalsButtonValue });

            const onMouseClick = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();

                const rect = renderer.domElement.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(buttons.map(b => b.mesh));

                if (intersects.length > 0) {
                    const clickedButton = buttons.find(b => b.mesh === intersects[0].object);
                    if (clickedButton) {
                        // Visual button press effect
                        clickedButton.mesh.position.z -= 0.02;
                        clickedButton.label.position.z -= 0.02;

                        setTimeout(() => {
                            clickedButton.mesh.position.z += 0.02;
                            clickedButton.label.position.z += 0.02;
                        }, 100);

                        // Call the button click handler using the ref
                        calculatorStateRef.current.handleButtonClick(clickedButton.value);
                    }
                }
            };

            // Handle both mouse down and up to detect clicks vs drags
            let mouseDownTime = 0;
            let mouseDownPosition = { x: 0, y: 0 };
            const CLICK_THRESHOLD = 200; // ms
            const MOVE_THRESHOLD = 5; // pixels

            const onMouseDown = (event: MouseEvent) => {
                mouseDownTime = Date.now();
                mouseDownPosition = { x: event.clientX, y: event.clientY };
            };

            const onMouseUp = (event: MouseEvent) => {
                const mouseUpTime = Date.now();
                const timeDiff = mouseUpTime - mouseDownTime;
                const moveDistance = Math.sqrt(
                    Math.pow(event.clientX - mouseDownPosition.x, 2) +
                    Math.pow(event.clientY - mouseDownPosition.y, 2)
                );

                // Only treat as click if it was quick and didn't move much (not a drag)
                if (timeDiff < CLICK_THRESHOLD && moveDistance < MOVE_THRESHOLD) {
                    onMouseClick(event);
                }
            };

            // Attach event listeners to the canvas
            renderer.domElement.addEventListener('mousedown', onMouseDown, { passive: false });
            renderer.domElement.addEventListener('mouseup', onMouseUp, { passive: false });

            return {
                calculatorGroup,
                cleanup: () => {
                    renderer.domElement.removeEventListener('mousedown', onMouseDown);
                    renderer.domElement.removeEventListener('mouseup', onMouseUp);
                }
            };
        };

        const { calculatorGroup, cleanup } = createCalculator();
        scene.add(calculatorGroup);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            cleanup();
            renderer.dispose();
            window.removeEventListener('resize', handleResize);
            // More thorough cleanup
            if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="flex flex-col w-full h-full min-h-0">
            <header className="py-4 font-mono text-center">
                <h1 className="text-4xl text-blue-900">NostalgiaCalc</h1>
                <h2 className="text-2xl text-blue-900">Just like you remember, but without the classroom!</h2>
            </header>

            <div className="flex-1 min-h-0 flex">
                <div ref={mountRef} className="w-full h-full min-h-0" />
            </div>

            <footer className="py-2 text-blue-900 font-mono text-center">
                © 2025
            </footer>
        </div>
    );
};

export default Calculator3D;