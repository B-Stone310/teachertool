document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 및 섹션 전환 기능
    const sections = document.querySelectorAll('.tool-section');
    const navLinks = document.querySelectorAll('nav ul li a');
    const toolCards = document.querySelectorAll('.tool-card');
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        document.getElementById(sectionId).classList.add('active');
        document.getElementById(sectionId + '-link').classList.add('active');
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.id.replace('-link', '');
            showSection(sectionId);
        });
    });
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const sectionId = this.id.replace('-card', '');
            showSection(sectionId);
        });
    });
    
    // 칠판 기능 구현
    const canvas = document.getElementById('drawing-board');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'pen';
    let currentColor = '#000000';
    let lineWidth = 5;
    
    // 캔버스 크기 설정
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
        ctx.lineWidth = currentTool === 'eraser' ? 20 : lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        
        // 마우스 또는 터치 위치 계산
        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const rect = canvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        ctx.lineTo(x, y);
        ctx.stroke();
        
        lastX = x;
        lastY = y;
    }
    
    canvas.addEventListener('mousedown', function(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
    });
    
    canvas.addEventListener('touchstart', function(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        lastX = e.touches[0].clientX - rect.left;
        lastY = e.touches[0].clientY - rect.top;
    });
    
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);
    
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
    canvas.addEventListener('touchend', () => isDrawing = false);
    
    // 도구 선택
    document.getElementById('pen-tool').addEventListener('click', function() {
        currentTool = 'pen';
    });
    
    document.getElementById('eraser-tool').addEventListener('click', function() {
        currentTool = 'eraser';
    });
    
    document.getElementById('color-picker').addEventListener('input', function() {
        currentColor = this.value;
        currentTool = 'pen';
    });
    
    document.getElementById('clear-board').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    // 타이머 기능 구현
    let timerInterval;
    let totalSeconds = 300; // 기본 5분
    let remainingSeconds = totalSeconds;
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    
    function updateTimerDisplay() {
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    function startTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(function() {
            if (remainingSeconds > 0) {
                remainingSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                alert('시간이 종료되었습니다!');
            }
        }, 1000);
    }
    
    document.getElementById('start-timer').addEventListener('click', startTimer);
    
    document.getElementById('pause-timer').addEventListener('click', function() {
        clearInterval(timerInterval);
    });
    
    document.getElementById('reset-timer').addEventListener('click', function() {
        clearInterval(timerInterval);
        remainingSeconds = totalSeconds;
        updateTimerDisplay();
    });
    
    document.getElementById('set-timer').addEventListener('click', function() {
        const minutes = prompt('분 단위로 시간을 입력하세요:', Math.floor(totalSeconds / 60));
        if (minutes !== null) {
            totalSeconds = parseInt(minutes) * 60;
            remainingSeconds = totalSeconds;
            updateTimerDisplay();
        }
    });
    
    // 타이머 프리셋 버튼
    const presetButtons = document.querySelectorAll('.timer-presets button');
    presetButtons.forEach(button => {
        button.addEventListener('click', function() {
            totalSeconds = parseInt(this.dataset.time);
            remainingSeconds = totalSeconds;
            updateTimerDisplay();
        });
    });
    
    // 학생 뽑기 기능 구현
    const studentList = document.getElementById('student-list');
    const pickButton = document.getElementById('pick-student');
    const selectedStudent = document.getElementById('selected-student');
    
    pickButton.addEventListener('click', function() {
        const students = studentList.value.split('\n').filter(name => name.trim() !== '');
        
        if (students.length === 0) {
            alert('학생 목록을 입력해주세요!');
            return;
        }
        
        // 애니메이션 효과
        let counter = 0;
        const shuffleInterval = setInterval(function() {
            selectedStudent.textContent = students[Math.floor(Math.random() * students.length)];
            counter++;
            
            if (counter > 20) {
                clearInterval(shuffleInterval);
                // 최종 선택
                const randomIndex = Math.floor(Math.random() * students.length);
                selectedStudent.textContent = students[randomIndex];
            }
        }, 100);
    });
    
    // 초기 상태 설정
    updateTimerDisplay();
});
