let panelContainer;
let currentSection = [];
let sections = [];

async function fetchPanelContainer() {
  const panelContainer = document.querySelector('[data-purpose="curriculum-section-container"]')
  return panelContainer.outerHTML;
}

function fetchSections(panel) {
  sections = panel.querySelectorAll('[data-purpose=curriculum-section-container] > [data-purpose]');
  const currentLecture = panel.querySelector('[class*="curriculum-item-link--is-current--"]')
  let tempCurrentSection = [];
  if (currentLecture) {
    currentSection = [currentLecture.closest('[data-purpose]')];
  }
}

function getLeftTime(isFullCourse = true) {  
  let tempSections = [];
  if (isFullCourse) {
    tempSections = sections;
  } else {
    tempSections = currentSection;
  }
  console.log('tempSections', tempSections)

  if (!tempSections.length) {
    return {error: true, text: 'No section found.\nBe sure that you are at the udemy course tab and you started the course'};
  }
  
  let totalMinutes = 0;

  tempSections.forEach((section) => {
    const header = section.querySelector('div');
    const checkbox = section.querySelector('span');
    const isExpanded = checkbox.getAttribute('data-checked');
    
    if (!isExpanded) {
      header.click();
    }
  })
  let items = [];

  if (isFullCourse) {
    items = panelContainer.querySelectorAll('[data-purpose^="curriculum-item-"][class*="item-link--common--"]') // each item
  } else {
    items = tempSections[0].querySelectorAll('[data-purpose^="curriculum-item-"][class*="item-link--common--"]') // each item
  }

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

  if (val.error) {
    timerEl.classList.add('error');
    timerEl.innerHTML = val ? val.text : 'something went wrong 😿';
    return;
  }

  timerEl.classList.remove('error');
  timerEl.innerHTML = `${val.hours}:${val.minutes}H Left`;
}

const callback = (tabs) => {
  const currentTab = tabs[0]; // there will be only one in this array
  const wholeCourseButton = document.querySelector('.whole-course')
  const currentSectionButton = document.querySelector('.current-section')
  const timerEl = document.querySelector('#timer');
  timerEl.innerHTML = 'Calculating...';

  wholeCourseButton.addEventListener('click', () => {
    console.log('button clicked 1')
    if (wholeCourseButton.classList.contains('active')) return;

    wholeCourseButton.classList.add('active');
    currentSectionButton.classList.remove('active');
    const val = getLeftTime();
    console.log('val', val)
    console.log('sections', sections)
    setTimer(val, timerEl)
  })

  currentSectionButton.addEventListener('click', () => {
    console.log('button clicked 2')

    if (currentSectionButton.classList.contains('active')) return;

    currentSectionButton.classList.add('active');
    wholeCourseButton.classList.remove('active');
    const val = getLeftTime(false);
    console.log('sections', currentSection)
    console.log('val', val)
    setTimer(val, timerEl)
  })

  chrome.scripting.executeScript({
    target: {tabId: currentTab.id },
    func: fetchPanelContainer
  }, (result) => {
    const panel = result[0].result;
    console.log('panel', panel)

    const parser = new DOMParser();
    panelContainer = parser.parseFromString(panel, "text/html");

    fetchSections(panelContainer)
    // currentSection = val[0].currentSection;
    const time = getLeftTime();
    console.log('time', time);
    // console.log('val', val)
    setTimer(time, timerEl)
  })
}

var query = { active: true, currentWindow: true };
chrome.tabs.query(query, callback);