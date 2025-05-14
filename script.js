document.addEventListener('DOMContentLoaded', function() {
    // 语言切换
    const languageToggle = document.getElementById('languageToggle');
    const translations = {
        'en': {
            'title': 'Gforce Freight Mel pick up reservation',
            'name': 'Receiver Name',
            'phone': 'Contact Number',
            'order': 'Order Number',
            'date': 'Pickup Date',
            'time': 'Pickup Time',
            'submit': 'Submit',
            'success': 'Reservation successful'
        },
        'zh': {
            'title': 'Gforce货运墨尔本取件预约',
            'name': '收货人姓名',
            'phone': '联系电话',
            'order': '订单号',
            'date': '取件日期',
            'time': '取件时段',
            'submit': '提交',
            'success': '您已预约成功'
        }
    };
    
    let currentLang = 'en';
    
    languageToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'zh' : 'en';
        languageToggle.textContent = currentLang === 'en' ? '中文' : 'English';
        updateLanguage();
    });

    function updateLanguage() {
        document.querySelector('h1').textContent = translations[currentLang].title;
        document.querySelector('label[for="name"]').textContent = translations[currentLang].name;
        document.querySelector('label[for="phone"]').textContent = translations[currentLang].phone;
        document.querySelector('label[for="order"]').textContent = translations[currentLang].order;
        document.querySelector('label[for="date"]').textContent = translations[currentLang].date;
        document.querySelector('label[for="time"]').textContent = translations[currentLang].time;
        document.querySelector('.submit-btn').textContent = translations[currentLang].submit;
    }

    // 日期选择器设置
    const dateInput = document.getElementById('date');
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    dateInput.min = formatDate(today);
    dateInput.max = formatDate(maxDate);
    
    dateInput.addEventListener('input', function() {
        updateTimeSlots();
    });

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    // 时间段生成
    const timeSelect = document.getElementById('time');
    
    function updateTimeSlots() {
        timeSelect.innerHTML = '';
        
        const selectedDate = new Date(dateInput.value);
        if (!dateInput.value || isWeekend(selectedDate)) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = translations[currentLang].date + ' ' + (isWeekend(selectedDate) ? 
                (currentLang === 'en' ? '(Weekend not available)' : '(周末不可选)') : 
                (currentLang === 'en' ? 'is required' : '必填'));
            option.disabled = true;
            option.selected = true;
            timeSelect.appendChild(option);
            return;
        }
        
        // 生成9:30-16:30的时间段
        const startHour = 9;
        const startMinute = 30;
        const endHour = 16;
        const interval = 30;
        
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = (hour === startHour ? startMinute : 0); 
                 minute < 60 && (hour < endHour || minute <= startMinute); 
                 minute += interval) {
                const nextMinute = minute + interval;
                const endHourDisplay = nextMinute === 60 ? hour + 1 : hour;
                const endMinuteDisplay = nextMinute === 60 ? 0 : nextMinute;
                
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}-${endHourDisplay.toString().padStart(2, '0')}:${endMinuteDisplay.toString().padStart(2, '0')}`;
                
                const option = document.createElement('option');
                option.value = timeString;
                option.textContent = timeString;
                timeSelect.appendChild(option);
            }
        }
    }

    // 表单提交
    const form = document.getElementById('reservationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            order: document.getElementById('order').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            accessKey: 'sf_b8ng44033b1d87ecfmjekf62'
        };
        
        fetch('https://api.staticforms.xyz/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            showSuccessMessage();
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    function showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = translations[currentLang].success;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 10000);
    }
});
