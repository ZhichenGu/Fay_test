/* Public integration surface. The engine remains responsible for drawing and sound. */
(() => {
  const events = [], errors = [];
  if(location.protocol === 'file:') {
    const notice=document.getElementById('local-error');
    notice.hidden=false;
    notice.innerHTML='请通过本地服务打开：<a href="http://127.0.0.1:8765/">打开 Brainstream 预览</a>。如果服务未启动，请先运行同目录的 start.command。';
  }
  const noop = () => {};
  window.AnalyticsController = {trackEvent:noop,trackEventDirectly:noop,pageview:noop,sendQueue:noop,setup:noop,init:noop};
  window.StorageController = {init:noop,setState:noop,clearState:noop,getState:()=>false};
  window.BrainstreamOpening = {
    state: 'title', index: 0, locked: false,
    restart() { location.reload(); },
    // Attach your original continuation here. This prototype never calls it automatically.
    continueWith(callback) { if (this.locked && typeof callback === 'function') callback({renderer:window.SequenceRenderer, audio:window.AudioEffectController}); }
  };
  const names=['title','headphones','context','date','instructions'];
  addEventListener('brainstream:state', ({detail}) => {
    const api=window.BrainstreamOpening;
    api.index=detail.index;api.state=names[detail.index];api.locked=detail.index===4;
    document.body.dataset.state=api.state;events.push({state:api.state,time:performance.now()});
    if(api.locked) dispatchEvent(new CustomEvent('brainstream:ready-for-continuation',{detail:{state:'instructions'}}));
  });
  addEventListener('error', e => errors.push({message:e.message || 'Resource failed',stack:e.error?.stack,resource:e.target?.src || e.target?.href || '',time:performance.now()}),true);
  addEventListener('unhandledrejection', e => errors.push({message:String(e.reason)}));
  document.getElementById('local-fullscreen').addEventListener('click',async()=>{
    try { if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen(); }catch(e){console.warn(e);}
  });
  document.getElementById('works').addEventListener('click',()=>window.MenuController?.openAbout());
  // Give canvas controls semantic names without changing their original artwork.
  const labels={'instructions-enter':'Enter','instructions-arrow':'Continue','intro-aboutbtn':'About Brainstream','info-back-button':'Close information'};
  for(const [id,label] of Object.entries(labels))document.getElementById(id)?.setAttribute('aria-label',label);
  // Local-only diagnostics. Static hosting simply ignores this optional endpoint.
  if(new URLSearchParams(location.search).has('qa') && ['localhost','127.0.0.1'].includes(location.hostname)) {
    const report=()=>fetch('/__report',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({state:window.BrainstreamOpening,events,errors,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio},resources:performance.getEntriesByType('resource').map(r=>({name:r.name,size:r.transferSize})),loadedFiles:window.allLoadedFiles,renderer:!!window.renderer,audioState:window.audioContext?.state})}).catch(noop);
    setInterval(report,3000);
  }
})();
