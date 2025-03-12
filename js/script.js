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
    const chalkboard = document.getElementById('chalkboard');
    const boldBtn = document.getElementById('bold-btn');
    const italicBtn = document.getElementById('italic-btn');
    const underlineBtn = document.getElementById('underline-btn');
    const fontSizeSelect = document.getElementById('font-size');
    const textColorSelect = document.getElementById('text-color');
    const highlightBtn = document.getElementById('highlight-btn');
    const highlightColorSelect = document.getElementById('highlight-color');
    const clearBtn = document.getElementById('clear-board');
    const copyBtn = document.getElementById('copy-btn');
    
    // 텍스트 서식 적용 함수
    function applyFormatting(command, value = null) {
        document.execCommand(command, false, value);
        chalkboard.focus();
    }
    
    // 버튼 클릭 이벤트
    boldBtn.addEventListener('click', () => {
        boldBtn.classList.toggle('active');
        applyFormatting('bold');
    });
    
    italicBtn.addEventListener('click', () => {
        italicBtn.classList.toggle('active');
        applyFormatting('italic');
    });
    
    underlineBtn.addEventListener('click', () => {
        underlineBtn.classList.toggle('active');
        applyFormatting('underline');
    });
    
    fontSizeSelect.addEventListener('change', () => {
        applyFormatting('fontSize', fontSizeSelect.value);
    });
    
    textColorSelect.addEventListener('change', () => {
        applyFormatting('foreColor', textColorSelect.value);
    });
    
    // 형광펜 기능 개선
    highlightBtn.addEventListener('click', () => {
        highlightBtn.classList.toggle('active');
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            
            if (selectedText) {
                const highlightColor = highlightColorSelect.value;
                
                // 형광펜 효과 적용
                const span = document.createElement('span');
                span.style.backgroundColor = highlightColor;
                span.style.color = 'black'; // 형광펜 위의 텍스트는 검정색으로
                
                try {
                    range.surroundContents(span);
                } catch (e) {
                    console.log('형광펜 적용 중 오류 발생:', e);
                    // 선택 영역이 복잡한 경우 대체 방법
                    applyFormatting('hiliteColor', highlightColor);
                }
            }
        }
    });
    
    // 형광펜 색상 변경 시 형광펜 버튼 활성화
    highlightColorSelect.addEventListener('change', () => {
        if (!highlightBtn.classList.contains('active')) {
            highlightBtn.click();
        }
    });
    
    clearBtn.addEventListener('click', () => {
        if (confirm('정말로 칠판을 지우시겠습니까?')) {
            chalkboard.innerHTML = '';
        }
    });
    
    copyBtn.addEventListener('click', () => {
        // 칠판 내용을 클립보드에 복사
        const range = document.createRange();
        range.selectNodeContents(chalkboard);
        
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        document.execCommand('copy');
        selection.removeAllRanges();
        
        alert('칠판 내용이 클립보드에 복사되었습니다.');
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
    
    // 칠판에 포커스가 있을 때 키보드 단축키 처리
    chalkboard.addEventListener('keydown', function(e) {
        // Ctrl+B: 굵게
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            boldBtn.click();
        }
        // Ctrl+I: 기울임
        else if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            italicBtn.click();
        }
        // Ctrl+U: 밑줄
        else if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            underlineBtn.click();
        }
    });
});
