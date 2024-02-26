function getLeftTime() {  
  const sections = document.querySelectorAll('[data-purpose=curriculum-section-container] > [data-purpose]');

  if (!sections.length) {
    return {error: true, text: 'No section found.\nBe sure that you are at the udemy course tab and you started the course'};
  }
  
  sections.forEach((section) => {
    const header = section.querySelector('div');
    const checkbox = section.querySelector('span');
    const isExpanded = checkbox.getAttribute('data-checked');
    
    if (!isExpanded) {
      header.click();
    }
  })
  
  let totalMinutes = 0;
  const items = document.querySelectorAll('[data-purpose^="curriculum-item-"][class*="item-link--common--"]') // each item
  if (!items.length) {
    return {error: true, text: 'No items found, be sure that sections are opened'};
  }
  try {
    items.forEach((item) => {
      const checkbox = item.querySelector('input[data-purpose="progress-toggle-button"]')
      const isChecked = checkbox.checked;
  
      if (!isChecked) {
        let timer = item.querySelector('[class^="curriculum-item-link--bottom-row"] span');
        if (timer) {
          time = timer.innerHTML.replace('min', '');
          totalMinutes+= parseInt(time);
        }
      }
    })
  
    const hours = Math.floor(totalMinutes / 60);          
    const minutes = totalMinutes % 60;
  
    return {error: false, hours, minutes};
  } catch (error) {
    return {error: true, text: 'Something went wrong please create an issue at <a href="https://github.com/edenizk/udemyRemainingTimerExtention/issues/new" target="_blank">https://github.com/edenizk/udemyRemainingTimerExtention/issues/new</a>. Error msg' + JSON.stringify(error)};
  }
}

const setTimer = (val, timerEl) => {
  if (!val) {
    timerEl.classList.add('error');
    timerEl.innerHTML = "Couldn't calculate try to open extension again";
    return;
  }
  const result = val[0].result;

  if (result.error) {
    timerEl.classList.add('error');
    timerEl.innerHTML = result.text;
    return;
  }

  timerEl.classList.remove('error');
  timerEl.innerHTML = `${result.hours}H:${result.minutes}M Left`;
}

const callback = (tabs) => {
  const currentTab = tabs[0]; // there will be only one in this array
  const timerEl = document.querySelector('#timer');
  timerEl.innerHTML = 'Calculating...';

  chrome.scripting.executeScript({
    target: {tabId: currentTab.id },
    func: getLeftTime
  }, (val) => setTimer(val, timerEl))
}

var query = { active: true, currentWindow: true };
chrome.tabs.query(query, callback);