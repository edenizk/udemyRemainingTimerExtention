let panelContainer;
let currentSection = [];
let sections = [];

const fetchPanelContainer = () => {
  const panelContainer = document.querySelector('[data-purpose="curriculum-section-container"]');
  sections = panelContainer.querySelectorAll('[data-purpose=curriculum-section-container] > [data-purpose]');

  sections.forEach((section) => {
    console.log('section', section)
    const header = section.querySelector('div');
    const checkbox = section.querySelector('span');
    const isExpanded = checkbox.getAttribute('data-checked');

    if (!isExpanded) {
      header.click();
    }
  });

  return panelContainer.outerHTML;
};

const fetchSections = (panel) => {
  sections = panel.querySelectorAll('[data-purpose=curriculum-section-container] > [data-purpose]');
  const currentLecture = panel.querySelector('[class*="curriculum-item-link--is-current--"]');
  currentSection = currentLecture ? [currentLecture.closest('[data-purpose]')] : [];
};

const getLeftTime = (isFullCourse = true) => {
  const tempSections = isFullCourse ? sections : currentSection;

  if (!tempSections.length) {
    return { error: true, text: 'No section found.\nBe sure that you are at the udemy course tab and you started the course' };
  }

  let totalMinutes = 0;

  let items = isFullCourse
    ? panelContainer.querySelectorAll('[data-purpose^="curriculum-item-"][class*="item-link--common--"]')
    : tempSections[0].querySelectorAll('[data-purpose^="curriculum-item-"][class*="item-link--common--"]');

  if (!items.length) {
    return { error: true, text: 'No items found, be sure that sections are opened' };
  }

  try {
    items.forEach((item) => {
      const checkbox = item.querySelector('input[data-purpose="progress-toggle-button"]');
      const isChecked = checkbox.checked;

      if (!isChecked) {
        let timer = item.querySelector('[class^="curriculum-item-link--bottom-row"] span');
        if (timer) {
          const time = parseInt(timer.innerHTML.replace('min', ''));
          totalMinutes += isNaN(time) ? 0 : time;
        }
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { error: false, hours, minutes };
  } catch (error) {
    return {
      error: true,
      text: `Something went wrong please create an issue at <a href="https://github.com/edenizk/udemyRemainingTimerExtention/issues/new" target="_blank">https://github.com/edenizk/udemyRemainingTimerExtention/issues/new</a>. Error msg ${JSON.stringify(error)}`,
    };
  }
};

const setTimer = (val, timerEl) => {
  if (!val || val.error) {
    timerEl.classList.add('error');
    timerEl.innerHTML = val ? val.text : 'Something went wrong 😿';
    return;
  }

  timerEl.classList.remove('error');
  timerEl.innerHTML = `${val.hours}:${val.minutes}H Left`;
};

const callback = (tabs) => {
  const currentTab = tabs[0];
  const timerSection = document.querySelector('.timer-section');
  const timerSectionButton = document.querySelector('.timer-section-button');
  const playbackSection = document.querySelector('.playback-section');
  const playbackButton = document.querySelector('.playback-section-button');
  const wholeCourseButton = document.querySelector('.whole-course');
  const currentSectionButton = document.querySelector('.current-section');
  const timerEl = document.querySelector('#timer');
  timerEl.innerHTML = 'Calculating...';

  wholeCourseButton.addEventListener('click', () => {
    if (wholeCourseButton.classList.contains('active')) return;

    wholeCourseButton.classList.add('active');
    currentSectionButton.classList.remove('active');
    const val = getLeftTime();
    setTimer(val, timerEl);
  });

  currentSectionButton.addEventListener('click', () => {
    if (currentSectionButton.classList.contains('active')) return;

    currentSectionButton.classList.add('active');
    wholeCourseButton.classList.remove('active');
    const val = getLeftTime(false);
    setTimer(val, timerEl);
  });

  console.log('timer', timerSection);
  console.log('playback', playbackSection);
  console.log('timerSectionButton', timerSectionButton);
  console.log('playbackButton', playbackButton);
  timerSectionButton.addEventListener('click', () => {
    if (timerSectionButton.classList.contains('active')) return;

    timerSection.classList.add('active');
    timerSectionButton.classList.add('active');
    playbackSection.classList.remove('active');
    playbackButton.classList.remove('active');
  });

  playbackButton.addEventListener('click', () => {
    if (playbackButton.classList.contains('active')) return;

    playbackSection.classList.add('active');
    playbackButton.classList.add('active');
    timerSection.classList.remove('active');
    timerSectionButton.classList.remove('active');
  });

  chrome.scripting.executeScript(
    {
      target: { tabId: currentTab.id },
      func: fetchPanelContainer,
    },
    (result) => {
      if (!result || !result.length) return;
      const panel = result[0].result;
      const parser = new DOMParser();
      panelContainer = parser.parseFromString(panel, 'text/html');

      fetchSections(panelContainer);
      const time = getLeftTime();
      setTimer(time, timerEl);
    }
  );
};

const query = { active: true, currentWindow: true };
chrome.tabs.query(query, callback);
