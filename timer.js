function getLeftTime() {  
  const sections = document.querySelectorAll('[data-purpose=curriculum-section-container] > [data-purpose]');
  console.log('Opening Sections...', sections);

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
  
  console.log('Opening Sections DONE');
  
  console.log('Calculation Total ...')
  
  let totalMinutes = 0;
  
  const items = document.querySelectorAll('.item-link.udlite-custom-focus-visible') // each item

  if (!items.length) {
    return {error: true, text: 'No items found, be sure that sections are opened'};
  }
  
  items.forEach((item) => {
    const isChecked = item.querySelector('.udlite-real-toggle-input').checked;
  
    if (!isChecked) {
      let timer = item.querySelector('.udlite-text-xs span');
    
      if (timer) {
        time = timer.innerText.replace('min', '');
        totalMinutes+= parseInt(time);
      }
    }
  })

  const hours = Math.floor(totalMinutes / 60);          
  const minutes = totalMinutes % 60;

  return {error: false, hours, minutes};
}

const setTimer = (val, timerEl) => {
  if (!val) {
    timerEl.innerHTML = "Couldn't calculate try to open extension again";
    return;
  }
  console.log('val', val);
  const result = val[0].result;

  if (result.error) {
    timerEl.innerHTML = result.text;
    document.body.insertAdjacentHTML('beforeend', '<strong>inserted text</strong>');
    return;
  }

  timerEl.innerHTML = `${result.hours}H:${result.minutes}M Left`;
}

const callback = (tabs) => {
  const currentTab = tabs[0]; // there will be only one in this array
  console.log('currentTab', currentTab);
  const timerEl = document.querySelector('#timer');
  console.log('timerEl', timerEl);
  timerEl.innerHTML = 'Calculating...';

  chrome.scripting.executeScript({
    target: {tabId: currentTab.id },
    func: getLeftTime
  }, (val) => setTimer(val, timerEl))
}

var query = { active: true, currentWindow: true };
chrome.tabs.query(query, callback);