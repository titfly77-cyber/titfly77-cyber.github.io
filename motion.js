/* Scroll and route motion live here so the static design export stays readable. */
window.TitanfyMotion = (() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = value => Math.min(1, Math.max(0, value));
  const ease = value => value * value * (3 - 2 * value);
  const lerp = (from, to, progress) => from + (to - from) * progress;
  const disabled = () => preference.matches || document.documentElement.classList.contains('export-mode');

  function mount({ icons, processData = [] }) {
    let frame = 0;
    let disposed = false;
    let geometry;
    let story;
    let stage;
    let traveler;
    let processStage;
    let processPanels=[];
    let processSteps=[];
    const processSection=document.querySelector('#process');
    const hero = document.querySelector('.hero');
    const title = hero?.querySelector('h1');
    const mediaSection = document.querySelector('.hero-media-section');
    const media = document.querySelector('.hero-media');
    const caption = document.querySelector('.video-caption');
    const video = document.querySelector('#hero-video');
    const toggle = document.querySelector('.video-toggle');
    const buttonRow = hero?.querySelector('.button-row');
    const normalMotion = !disabled();
    let manuallyPaused = false;
    let manuallyPlaying = false;
    let lastProgress = 0;
    let playPending = false;

    if (hero && normalMotion) {
      story = document.createElement('div');
      story.className = 'motion-story';
      stage = document.createElement('div');
      stage.className = 'motion-stage';
      hero.before(story);
      story.append(stage);
      stage.append(hero, mediaSection);
      hero.classList.add('motion-intro');
      title.classList.add('motion-title');
      traveler=title.cloneNode(true);
      traveler.removeAttribute('id');
      traveler.className='title-traveler';
      traveler.setAttribute('aria-hidden','true');
      document.body.append(traveler);
      title.style.opacity='0';
      const hint = document.createElement('div');
      hint.className = 'scroll-hint';
      hint.setAttribute('aria-hidden', 'true');
      hint.setAttribute('data-export-hide', '');
      hint.innerHTML = '<span>Scroll to explore</span><span class="scroll-hint-line"></span>';
      stage.append(hint);
    }

    if(processSection&&processData.length){
      if(story)story.after(processSection);else mediaSection?.after(processSection);
      const wrap=processSection.querySelector('.wrap');
      processSection.querySelector('.process-detail')?.remove();
      processSection.querySelector('.process-steps').removeAttribute('role');
      processSection.querySelectorAll('.process-step').forEach(button=>{const step=document.createElement('div');step.className=button.className;step.innerHTML=button.innerHTML;step.dataset.step=button.dataset.step;button.replaceWith(step);});
      processSteps=[...processSection.querySelectorAll('.process-step')];
      const outputs=['场景观察 · 需求线索 · 问题定义','业务流程 · 功能优先级 · PRD','Figma 原型 · 交互说明 · 关键状态','研发分工 · 原型联调 · 迭代清单','测试记录 · 数据对比 · 复盘汇报'];
      const panels=document.createElement('div');panels.className='process-panels';
      panels.innerHTML=processData.map(([name,desc,label,body],i)=>`<article class="process-panel" data-phase="${i}"><span class="process-count">0${i+1} / 05</span><h3>${name}</h3><h4>${label}</h4><p>${body}</p><div class="process-output"><span>OUTPUT</span><strong>${outputs[i]}</strong></div></article>`).join('');
      wrap.append(panels);processPanels=[...panels.children];
      if(normalMotion){processSection.classList.add('process-scroll');wrap.classList.add('process-stage');processStage=wrap;}
      else{processSection.classList.add('process-static');}
    }

    const revealSelectors = '.statement,.section-head,.card,.cap-group,.experience-row,.about-grid,.contact-section,.page-intro,.case-cover,.case-section,.next-case,.about-evidence,.mini-project,.internship-detail,.footer';
    const reveal = normalMotion ? [...document.querySelectorAll(revealSelectors)]
      .filter(node => !node.parentElement.closest(revealSelectors))
      .map(node => { node.classList.add('scroll-reveal'); return { node, offset: 0 }; }) : [];

    function updateVideoUI() {
      if (!video) return;
      toggle.innerHTML = video.paused ? icons.play : icons.pause;
      toggle.setAttribute('aria-label', video.paused ? 'Play hero video' : 'Pause hero video');
      media.dataset.cursor = video.paused ? 'PLAY' : 'PAUSE';
    }
    function playVideo() {
      if (!video || !video.paused || playPending || disposed) return;
      playPending = true;
      video.play().catch(() => {}).finally(() => { playPending = false; updateVideoUI(); });
    }
    function toggleVideo() {
      if (video.paused) {
        manuallyPaused = false;
        manuallyPlaying = true;
        playVideo();
      } else {
        manuallyPaused = true;
        manuallyPlaying = false;
        video.pause();
      }
    }
    function videoError() {
      document.querySelector('.video-fallback').hidden = false;
      toggle.hidden = true;
    }

    function measure() {
      if (!story || !title) return;
      const navHeight = document.querySelector('.nav').offsetHeight;
      const viewportHeight = window.innerHeight;
      const stageHeight = viewportHeight - navHeight;
      const mobile = innerWidth <= 560;
      const titleScale = mobile ? 1.5 : 2.25;
      const videoWidth = Math.min(1280, innerWidth - (mobile ? 32 : 80), Math.max(280, stageHeight - 210) * 16 / 9);
      const videoHeight = videoWidth * 9 / 16;
      const titleHeight = title.offsetHeight * titleScale;
      const groupHeight = videoHeight + 28 + titleHeight + 24 + caption.offsetHeight;
      const mediaTop = Math.max(28, (stageHeight - groupHeight) / 2);
      const titleTop = mediaTop + videoHeight + 28;
      const captionTop = titleTop + titleHeight + 24;
      const titleNaturalTop = title.offsetTop;
      const scrollRange = Math.round(viewportHeight * (mobile ? 0.88 : 0.94));
      const dockRange=Math.round(viewportHeight*.76);
      const brand=document.querySelector('.brand').getBoundingClientRect();
      const titleWidth=title.offsetWidth;
      const titleFont=parseFloat(getComputedStyle(title).fontSize);
      const dockScale=(mobile?12:13)/titleFont;
      const dockCenter=brand.right+12+titleWidth*dockScale/2;
      geometry = { titleCenter: title.offsetLeft+title.offsetWidth/2, navHeight, stageHeight, mobile, titleScale, videoWidth, videoHeight, mediaTop, titleTop, titleNaturalTop, captionTop, scrollRange,dockRange,dockScale,dockCenter,titleWidth };
      story.style.setProperty('--stage-height', stageHeight + 'px');
      story.style.setProperty('--story-height', stageHeight + scrollRange + dockRange + 'px');
      story.style.setProperty('--nav-height', navHeight + 'px');
      story.style.setProperty('--video-width', videoWidth + 'px');
      story.style.setProperty('--video-height', videoHeight + 'px');
      story.style.setProperty('--caption-top', captionTop + 'px');
      Object.assign(traveler.style,{width:titleWidth+'px',fontSize:titleFont+'px',lineHeight:getComputedStyle(title).lineHeight,letterSpacing:getComputedStyle(title).letterSpacing,left:(innerWidth-titleWidth)/2+'px',top:'0px'});
      if(processStage)processSection.style.setProperty('--process-height',Math.round(innerHeight*4.6)+'px');
      window.__heroMotionGeometry = { ...geometry, triggerProgress: 0.18 };
    }

    function update() {
      frame = 0;
      if (disposed) return;
      let progress = 0;
      if (story && geometry) {
        const distance=geometry.navHeight-story.getBoundingClientRect().top;
        progress = clamp(distance / geometry.scrollRange);
        const dock=ease(clamp((distance-geometry.scrollRange)/geometry.dockRange));
        const travel = ease(progress);
        const intro = 1 - ease(clamp((progress - 0.04) / 0.34));
        const firstTop=geometry.navHeight+lerp(geometry.titleNaturalTop,geometry.titleTop,travel);
        const firstScale=lerp(1,geometry.titleScale,travel);
        const dockTop=(geometry.navHeight-title.offsetHeight*geometry.dockScale)/2;
        traveler.style.transform=`translate3d(${lerp(lerp(geometry.titleCenter-innerWidth/2,0,travel),geometry.dockCenter-innerWidth/2,dock)}px,${lerp(firstTop,dockTop,dock)}px,0) scale(${lerp(firstScale,geometry.dockScale,dock)})`;
        traveler.dataset.docked=String(dock>.999);
        story.style.setProperty('--intro-opacity', intro.toFixed(4));
        story.style.setProperty('--intro-offset', (-32 * (1 - intro)).toFixed(2) + 'px');
        story.style.setProperty('--film-offset', lerp(geometry.stageHeight + 32, geometry.mediaTop, travel).toFixed(2) + 'px');
        story.style.setProperty('--film-scale', lerp(0.9, 1, travel).toFixed(4));
        story.style.setProperty('--caption-opacity', (ease(clamp((progress - 0.77) / 0.23))*(1-dock)).toFixed(4));
        story.dataset.progress = progress.toFixed(4);
        story.dataset.dock=dock.toFixed(4);
        window.__heroDockProgress=dock;
        buttonRow.inert = progress > 0.32;
        media.inert = progress < 0.18;
        if (progress <= 0.01 && lastProgress > 0.01 && video) {
          video.pause();
          video.currentTime = 0;
          manuallyPlaying = false;
        }
        lastProgress = progress;
      }
      if(processStage){
        const height=processSection.offsetHeight-processStage.offsetHeight;
        const p=clamp((64-processSection.getBoundingClientRect().top)/Math.max(1,height));
        const phase=Math.min(4,Math.floor(p*5));
        processSteps.forEach((step,i)=>{step.classList.toggle('active',i===phase);step.setAttribute('aria-current',i===phase?'step':'false');});
        processPanels.forEach((panel,i)=>{const active=i===phase;panel.classList.toggle('active',active);panel.setAttribute('aria-hidden',String(!active));});
        processSection.style.setProperty('--process-progress',String(p));processSection.dataset.phase=String(phase);window.__processScrollPhase=phase;
      }
      if (video) {
        const bounds = media.getBoundingClientRect();
        const visible = bounds.top < innerHeight - 24 && bounds.bottom > (geometry?.navHeight || 60) + 24;
        const shouldPlay = visible && !document.hidden && !manuallyPaused && (manuallyPlaying || (normalMotion && !disabled() && (!story || progress >= 0.18)));
        if (shouldPlay) playVideo(); else video.pause();
      }
      for (const item of reveal) {
        if (item.node.hidden) continue;
        const bounds = item.node.getBoundingClientRect();
        const naturalTop = bounds.top - item.offset;
        const entrance = ease(clamp((innerHeight - naturalTop - 18) / Math.min(230, innerHeight * 0.26)));
        item.offset = 24 * (1 - entrance);
        item.node.style.setProperty('--reveal-y', item.offset.toFixed(2) + 'px');
        item.node.style.setProperty('--reveal-opacity', entrance.toFixed(4));
      }
      window.__heroMotionProgress = progress;
    }
    function requestUpdate() { if (!frame) frame = requestAnimationFrame(update); }
    function resize() { measure(); requestUpdate(); }
    function preferenceChanged() { window.dispatchEvent(new Event('prototype:motion-preference')); }

    if (video) {
      video.muted = true;
      video.playsInline = true;
      video.autoplay = false;
      video.pause();
      video.addEventListener('canplay', requestUpdate);
      video.addEventListener('loadeddata', requestUpdate);
      video.addEventListener('play', updateVideoUI);
      video.addEventListener('pause', updateVideoUI);
      video.addEventListener('error', videoError);
      media.addEventListener('click', toggleVideo);
      updateVideoUI();
    }
    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', requestUpdate);
    preference.addEventListener('change', preferenceChanged);
    const contentObserver = new ResizeObserver(requestUpdate);
    const main = document.querySelector('main');
    if (main) contentObserver.observe(main);
    measure();
    update();
    document.fonts.ready.then(() => { if (!disposed) resize(); });

    return () => {
      disposed = true;
      traveler?.remove();
      cancelAnimationFrame(frame);
      removeEventListener('scroll', requestUpdate);
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', requestUpdate);
      preference.removeEventListener('change', preferenceChanged);
      contentObserver.disconnect();
      if (video) {
        video.pause();
        video.removeEventListener('canplay', requestUpdate);
        video.removeEventListener('loadeddata', requestUpdate);
        video.removeEventListener('play', updateVideoUI);
        video.removeEventListener('pause', updateVideoUI);
        video.removeEventListener('error', videoError);
        media.removeEventListener('click', toggleVideo);
      }
    };
  }

  let activeTransition;
  function navigate(render, hasCurrentPage) {
    activeTransition?.skipTransition();
    if (hasCurrentPage && !disabled() && document.startViewTransition) {
      document.documentElement.dataset.routeMotion = 'running';
      const transition = document.startViewTransition(render);
      activeTransition = transition;
      transition.finished.catch(() => {}).finally(() => {
        if (activeTransition === transition) {
          activeTransition = null;
          document.documentElement.dataset.routeMotion = 'idle';
        }
      });
    } else {
      render();
      document.documentElement.dataset.routeMotion = 'idle';
      if (hasCurrentPage && !disabled()) document.querySelector('main')?.animate(
        [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
    }
  }
  return { mount, navigate };
})();

