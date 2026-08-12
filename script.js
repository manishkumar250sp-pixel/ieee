const qrText = 'IEEE Presidency University Student Branch — scan for more information and contact the IEEE student chapter team.';
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qrText)}`;

const heroHighlights = [
  {
    title: 'IEEE purpose explained',
    text: 'IEEE advances technology for humanity and connects students with global technical opportunities, project funding, workshops, and research communities.'
  },
  {
    title: 'University chapter journey',
    text: 'Started in 2023 with 10 founding members, the Presidency IEEE chapter now hosts workshops, international conferences, and IoT society events.'
  },
  {
    title: 'Society collaborations',
    text: 'IEEE ComSoc, CAS, PELS, IES, and YESIST12 bring students practical skills and industry exposure.'
  },
  {
    title: 'Fast presentation support',
    text: 'This page is optimized for a 3–4 minute talk with clear sections, attractive visuals, and automatic story flow.'
  }
];

const highlightCards = [
  {
    title: 'What is IEEE & Why it matters?',
    content: 'IEEE is the world’s largest technical organization for students and professionals, offering exposure, technical skill development, networking, and project funding.'
  },
  {
    title: 'Milestones at Presidency University',
    content: '2023 chapter launch, analog circuit workshop, IoT Unplugged event, and an international conference on sustainable technology.'
  },
  {
    title: 'Funding opportunities',
    content: 'EPICS grants ($1k–$10k), travel reimbursements ($500–$1500), and society conference support for accepted papers.'
  },
  {
    title: 'Flagship event support',
    content: 'Grants from IEEE societies like ComSoc, CAS, PELS, and more to support student travel and paper presentation.'
  }
];

const timelineItems = [
  {
    year: '2023',
    label: 'Chapter established',
    details: 'IEEE Student Chapter launched at Presidency University with 10 founding members and new campus activities.'
  },
  {
    year: '2023',
    label: 'First workshop',
    details: 'Hands-on bipolar and CMOS analog circuit design workshop held July 17–22, 2023.'
  },
  {
    year: '2025',
    label: 'IoT Unplugged',
    details: 'IEEE ComSoc event on IoT technologies with expert talks and hands-on sessions.'
  },
  {
    year: '2023',
    label: 'International conference',
    details: 'Hosted the International Conference on Recent Innovation in Smart and Sustainable Technology.'
  }
];

const achievements = [
  { title: 'IIT-Delhi Hackathon', description: 'Participation at a major hackathon at IIT Delhi in January 2026.' },
  { title: 'CAS Design Program', description: '3rd place shortlist in CAS Student Design Program – Asia Pacific.' },
  { title: 'AI Autonomous Hackathon', description: '2nd prize at AI Autonomous Hackathon 2025, Vijayawada.' },
  { title: 'IEEE I2CONECCT-2025', description: '1st place at IEEE I2CONECCT-2025 in Mangaluru.' },
  { title: 'YESIST12 Award', description: 'Best project award in IEEE YESIST12 prelims, selected for Malaysia finals.' },
  { title: 'PELS / IES recognition', description: 'Top positions at IEEE PELS and IES event 2025.' }
];

const fundingItems = [
  {
    title: 'EPICS in IEEE',
    amount: '$1,000–$10,000',
    description: 'Grants for community-impact engineering projects; best for hardware, social impact, and humanitarian technology.'
  },
  {
    title: 'Travel grants',
    amount: '$500–$1,500',
    description: 'Reimbursement for student conference attendance, papers, competitions, and presentations.'
  },
  {
    title: 'Society flagship support',
    amount: 'Up to $1,250',
    description: 'ComSoc, CAS, PELS and others support travel for accepted papers and major conference participation.'
  }
];

const galleryImages = [
  'pptx_images/slide1_img1.png', 'pptx_images/slide1_img2.png', 'pptx_images/slide1_img3.png', 'pptx_images/slide1_img4.png',
  'pptx_images/slide2_img5.png', 'pptx_images/slide2_img6.png', 'pptx_images/slide2_img7.png',
  'pptx_images/slide3_img8.png', 'pptx_images/slide3_img9.png', 'pptx_images/slide3_img10.png',
  'pptx_images/slide4_img11.png', 'pptx_images/slide4_img12.png', 'pptx_images/slide4_img13.png', 'pptx_images/slide4_img14.png',
  'pptx_images/slide5_img15.png', 'pptx_images/slide5_img16.png', 'pptx_images/slide5_img17.png', 'pptx_images/slide5_img18.png',
  'pptx_images/slide5_img19.png', 'pptx_images/slide5_img20.png', 'pptx_images/slide5_img21.png', 'pptx_images/slide5_img22.png',
  'pptx_images/slide5_img23.png', 'pptx_images/slide5_img24.png', 'pptx_images/slide5_img25.png', 'pptx_images/slide5_img26.png',
  'pptx_images/slide5_img27.png', 'pptx_images/slide6_img28.png', 'pptx_images/slide6_img29.png', 'pptx_images/slide6_img30.png',
  'pptx_images/slide7_img31.png', 'pptx_images/slide7_img32.png', 'pptx_images/slide7_img33.png', 'pptx_images/slide7_img34.png',
  'pptx_images/slide7_img35.png', 'pptx_images/slide8_img36.png', 'pptx_images/slide8_img37.png', 'pptx_images/slide8_img38.png',
  'pptx_images/slide8_img39.jpg', 'pptx_images/slide8_img40.jpg', 'pptx_images/slide9_img41.png', 'pptx_images/slide9_img42.png',
  'pptx_images/slide9_img43.png', 'pptx_images/slide9_img44.jpg', 'pptx_images/slide9_img45.jpg', 'pptx_images/slide10_img46.png',
  'pptx_images/slide10_img47.png', 'pptx_images/slide10_img48.png', 'pptx_images/slide10_img49.jpg', 'pptx_images/slide10_img50.jpg',
  'pptx_images/slide11_img51.png', 'pptx_images/slide11_img52.png', 'pptx_images/slide11_img53.png', 'pptx_images/slide11_img54.jpg',
  'pptx_images/slide12_img55.png', 'pptx_images/slide12_img56.png', 'pptx_images/slide12_img57.png', 'pptx_images/slide12_img58.jpg',
  'pptx_images/slide12_img59.jpg', 'pptx_images/slide13_img60.png', 'pptx_images/slide13_img61.png', 'pptx_images/slide13_img62.png',
  'pptx_images/slide14_img63.png', 'pptx_images/slide14_img64.png', 'pptx_images/slide14_img65.png', 'pptx_images/slide15_img66.png',
  'pptx_images/slide15_img67.png', 'pptx_images/slide15_img68.png', 'pptx_images/slide16_img69.png', 'pptx_images/slide16_img70.png',
  'pptx_images/slide16_img71.png', 'pptx_images/slide17_img72.png', 'pptx_images/slide17_img73.png', 'pptx_images/slide17_img74.png',
  'pptx_images/slide18_img75.png', 'pptx_images/slide18_img76.png', 'pptx_images/slide18_img77.png', 'pptx_images/slide19_img78.png',
  'pptx_images/slide19_img79.png', 'pptx_images/slide19_img80.png', 'pptx_images/slide20_img81.png',
  'pptx_images/slide20_img82.png', 'pptx_images/slide20_img83.png', 'pptx_images/slide20_img84.png'
];

const placeholderImageMap = {
  logo_ieee: 'pptx_images/slide1_img1.png',
  logo_presidency: 'pptx_images/slide1_img2.png',
  logo_bangalore_section: 'pptx_images/slide1_img3.png',
  soc_cas: 'pptx_images/slide2_img5.png',
  soc_sps: 'pptx_images/slide2_img6.png',
  soc_comsoc: 'pptx_images/slide2_img7.png',
  soc_cis: 'pptx_images/slide3_img8.png',
  soc_nano: 'pptx_images/slide3_img9.png',
  soc_sensors: 'pptx_images/slide3_img10.png',
  soc_ceda: 'pptx_images/slide4_img11.png',
  soc_ctsoc: 'pptx_images/slide4_img12.png',
  soc_pels: 'pptx_images/slide4_img13.png',
  soc_ies: 'pptx_images/slide4_img14.png',
  ach_iitdelhi_team: 'pptx_images/slide5_img15.png',
  ach_cas_team: 'pptx_images/slide5_img16.png',
  ach_ai_hack_team: 'pptx_images/slide5_img17.png',
  ach_i2conect_team: 'pptx_images/slide5_img18.png',
  ach_yesist12_team: 'pptx_images/slide5_img19.png',
  ach_pels_ies_1: 'pptx_images/slide5_img20.png'
};

function fillTemplateImagePlaceholders() {
  document.querySelectorAll('img').forEach((img) => {
    const srcAttr = img.getAttribute('src');
    if (!srcAttr) return;
    const match = srcAttr.match(/{{\s*([^}]+)\s*}}/);
    if (!match) return;
    const key = match[1].trim();
    if (key === 'qr_code') return;
    img.src = placeholderImageMap[key] || galleryImages[0];
  });
}

function renderHeroCarousel() {
  const container = document.getElementById('highlightCarousel');
  heroHighlights.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'hero-highlight';
    if (index !== 0) slide.style.display = 'none';

    const title = document.createElement('h3');
    title.textContent = item.title;
    const text = document.createElement('p');
    text.textContent = item.text;

    slide.append(title, text);
    container.appendChild(slide);
  });
}

function rotateHeroCarousel() {
  const slides = Array.from(document.querySelectorAll('.hero-highlight'));
  let activeIndex = 0;
  setInterval(() => {
    slides[activeIndex].style.display = 'none';
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].style.display = 'grid';
  }, 4200);
}

function renderHighlights() {
  const grid = document.getElementById('highlightCards');
  highlightCards.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'highlight-card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.content}</p>`;
    grid.appendChild(card);
  });
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  timelineItems.forEach((item) => {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.innerHTML = `<span>${item.year}</span><h3>${item.label}</h3><p>${item.details}</p>`;
    list.appendChild(entry);
  });
}

function renderAchievements() {
  const grid = document.getElementById('achievementGrid');
  achievements.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'achievement-card';
    card.innerHTML = `<h3>${item.title}</h3><p>${item.description}</p>`;
    grid.appendChild(card);
  });
}

function renderFunding() {
  const grid = document.getElementById('fundingGrid');
  fundingItems.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'funding-card';
    card.innerHTML = `<h3>${item.title}</h3><strong>${item.amount}</strong><p>${item.description}</p>`;
    grid.appendChild(card);
  });
}

function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  galleryImages.forEach((src) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = src.split('/').pop();
    image.loading = 'lazy';
    grid.appendChild(image);
  });
}

function connectQR() {
  const qrImage = document.getElementById('qrImage');
  qrImage.src = qrUrl;
}

function setupCopyButton() {
  const button = document.getElementById('copyButton');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(qrText);
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.textContent = 'Copy summary text';
      }, 1800);
    } catch (error) {
      button.textContent = 'Copy failed';
    }
  });
}

function revealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

window.addEventListener('DOMContentLoaded', () => {
  fillTemplateImagePlaceholders();
  renderHeroCarousel();
  rotateHeroCarousel();
  renderHighlights();
  renderTimeline();
  renderAchievements();
  renderFunding();
  renderGallery();
  connectQR();
  setupCopyButton();
  revealOnScroll();
});
