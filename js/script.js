document.addEventListener('DOMContentLoaded', function() {
    // 현재 시간 및 날짜 표시 기능
    function updateCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        document.getElementById('current-time-display').textContent = `${hours}:${minutes}:${seconds}`;
        
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
        
        document.getElementById('current-date').textContent = `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
    }
    
    // 초기 시간 설정 및 1초마다 업데이트
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // 타이머 기능
    const hoursInput = document.getElementById('hours-input');
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const pauseTimerBtn = document.getElementById('pause-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    
    let timerInterval;
    let totalSeconds = 0;
    let remainingSeconds = 0;
    
    function updateTimerInputs() {
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;
        
        hoursInput.value = hours;
        minutesInput.value = minutes;
        secondsInput.value = seconds;
    }
    
    function updateTimerDisplay() {
        const hours = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
        const seconds = (remainingSeconds % 60).toString().padStart(2, '0');
        
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    function startTimer() {
        clearInterval(timerInterval);
        
        // 타이머가 0이면 입력값으로 설정
        if (remainingSeconds <= 0) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
            remainingSeconds = totalSeconds;
        }
        
        if (remainingSeconds <= 0) return;
        
        timerInterval = setInterval(function() {
            if (remainingSeconds > 0) {
                remainingSeconds--;
                updateTimerDisplay();
                updateTimerInputs();
            } else {
                clearInterval(timerInterval);
                // 타이머 종료 시 알림음 재생
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
            }
        }, 1000);
    }
    
    startTimerBtn.addEventListener('click', startTimer);
    
    pauseTimerBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
    });
    
    resetTimerBtn.addEventListener('click', function() {
        clearInterval(timerInterval);
        hoursInput.value = 0;
        minutesInput.value = 0;
        secondsInput.value = 0;
        totalSeconds = 0;
        remainingSeconds = 0;
        updateTimerDisplay();
    });
    
    // 타이머 입력값 변경 시 타이머 업데이트
    [hoursInput, minutesInput, secondsInput].forEach(input => {
        input.addEventListener('change', function() {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            
            totalSeconds = hours * 3600 + minutes * 60 + seconds;
            remainingSeconds = totalSeconds;
            updateTimerDisplay();
        });
    });
    
    // 초기 타이머 표시 업데이트
    updateTimerDisplay();
    
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
    
    // 칠판 지우기 - 확인 메시지 없이 바로 지우기
    clearBtn.addEventListener('click', () => {
        chalkboard.innerHTML = '';
    });
    
    // 선택한 부분만 복사하기
    copyBtn.addEventListener('click', () => {
        const selection = window.getSelection();
        
        // 선택된 텍스트가 있는지 확인
        if (selection.toString().length > 0) {
            document.execCommand('copy');
        } else {
            // 선택된 텍스트가 없으면 전체 칠판 내용 복사
            const range = document.createRange();
            range.selectNodeContents(chalkboard);
            
            selection.removeAllRanges();
            selection.addRange(range);
            
            document.execCommand('copy');
            selection.removeAllRanges();
        }
    });
    
    // 학생 뽑기 기능 구현
    const studentList = document.getElementById('student-list');
    const excelUpload = document.getElementById('excel-upload');
    const sheetSelect = document.getElementById('sheet-select');
    const columnSelect = document.getElementById('column-select');
    const excelPreview = document.getElementById('excel-preview');
    const pickButton = document.getElementById('pick-student');
    const selectedStudent = document.getElementById('selected-student');
    
    let excelData = null;
    let selectedStudents = [];
    
    // 엑셀 파일 업로드 처리
    excelUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // 엑셀 데이터 저장
                excelData = workbook;
                
                // 시트 목록 업데이트
                sheetSelect.innerHTML = '<option value="">시트 선택</option>';
                workbook.SheetNames.forEach(sheetName => {
                    const option = document.createElement('option');
                    option.value = sheetName;
                    option.textContent = sheetName;
                    sheetSelect.appendChild(option);
                });
                
                sheetSelect.disabled = false;
                columnSelect.disabled = true;
                columnSelect.innerHTML = '<option value="">열 선택</option>';
                excelPreview.innerHTML = '시트를 선택하세요.';
                
            } catch (error) {
                console.error('엑셀 파일 처리 중 오류 발생:', error);
                excelPreview.innerHTML = '파일을 읽는 중 오류가 발생했습니다.';
            }
        };
        reader.readAsArrayBuffer(file);
    });
    
    // 시트 선택 시 열 목록 업데이트
    sheetSelect.addEventListener('change', function() {
        const sheetName = this.value;
        if (!sheetName || !excelData) return;
        
        try {
            const worksheet = excelData.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // 첫 번째 행이 있으면 열 목록 업데이트
            if (jsonData.length > 0) {
                columnSelect.innerHTML = '<option value="">열 선택</option>';
                
                // 열 인덱스를 A, B, C 형식으로 변환
                jsonData[0].forEach((_, index) => {
                    const columnLetter = String.fromCharCode(65 + index); // A, B, C, ...
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = `${columnLetter}열`;
                    columnSelect.appendChild(option);
                });
                
                // 미리보기 표시
                let previewHTML = '<table border="1" style="width:100%; border-collapse: collapse;">';
                for (let i = 0; i < Math.min(5, jsonData.length); i++) {
                    previewHTML += '<tr>';
                    for (let j = 0; j < jsonData[i].length; j++) {
                        previewHTML += `<td style="padding: 5px;">${jsonData[i][j] || ''}</td>`;
                    }
                    previewHTML += '</tr>';
                }
                previewHTML += '</table>';
                
                if (jsonData.length > 5) {
                    previewHTML += '<p>... 더 많은 데이터가 있습니다.</p>';
                }
                
                excelPreview.innerHTML = previewHTML;
                columnSelect.disabled = false;
            } else {
                excelPreview.innerHTML = '데이터가 없습니다.';
                columnSelect.disabled = true;
            }
        } catch (error) {
            console.error('시트 데이터 처리 중 오류 발생:', error);
            excelPreview.innerHTML = '시트 데이터를 읽는 중 오류가 발생했습니다.';
        }
    });
    
    // 열 선택 시 학생 목록 업데이트
    columnSelect.addEventListener('change', function() {
        const columnIndex = parseInt(this.value);
        const sheetName = sheetSelect.value;
        
        if (isNaN(columnIndex) || !sheetName || !excelData) return;
        
        try {
            const worksheet = excelData.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // 선택한 열의 데이터 추출 (첫 번째 행은 헤더로 간주하고 제외)
            selectedStudents = [];
            for (let i = 1; i < jsonData.length; i++) {
                if (jsonData[i][columnIndex] && jsonData[i][columnIndex].toString().trim() !== '') {
                    selectedStudents.push(jsonData[i][columnIndex].toString());
                }
            }
            
            // 미리보기 업데이트
            let previewHTML = '<h4>선택된 학생 목록:</h4><ul>';
            for (let i = 0; i < Math.min(10, selectedStudents.length); i++) {
                previewHTML += `<li>${selectedStudents[i]}</li>`;
            }
            if (selectedStudents.length > 10) {
                previewHTML += `<li>... 외 ${selectedStudents.length - 10}명</li>`;
            }
            previewHTML += '</ul>';
            
            excelPreview.innerHTML = previewHTML;
            
        } catch (error) {
            console.error('열 데이터 처리 중 오류 발생:', error);
            excelPreview.innerHTML = '데이터를 처리하는 중 오류가 발생했습니다.';
        }
    });
    
    // 학생 뽑기 버튼 클릭 이벤트
    pickButton.addEventListener('click', function() {
        let students = [];
        
        // 텍스트 입력에서 학생 목록 가져오기
        if (studentList.value.trim() !== '') {
            students = studentList.value.split('\n').filter(name => name.trim() !== '');
        }
        // 엑셀에서 선택한 학생 목록 사용
        else if (selectedStudents.length > 0) {
            students = selectedStudents;
        }
        
        if (students.length === 0) {
            alert('학생 목록을 입력하거나 엑셀 파일에서 선택해주세요!');
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
