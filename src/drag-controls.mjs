// Optional pointer dragging. Tap-to-select remains the primary accessible fallback.
// No correctness checks run here: this controls movement only.
export function dragDistanceReached(startX, startY, x, y, threshold = 12) {
  return Math.hypot(x - startX, y - startY) >= threshold;
}

export function resolveDropTarget(element) {
  if (!element?.closest) return null;
  const slot = element.closest('.slot[data-lane][data-slot]:not([disabled])');
  if (slot) return { kind: 'slot', lane: Number(slot.dataset.lane), slot: Number(slot.dataset.slot) };
  return element.closest('.pile') ? { kind: 'pile' } : null;
}

export function installDragAndDrop(root, onDrop) {
  let gesture = null;
  let ghost = null;
  let highlighted = null;
  let blockClickUntil = 0;

  function clearVisuals() {
    highlighted?.classList.remove('drag-target');
    highlighted = null;
    gesture?.source?.classList.remove('drag-origin');
    ghost?.remove();
    ghost = null;
    root.classList.remove('drag-active');
  }

  function cancelDrag() {
    clearVisuals();
    gesture = null;
  }

  // After a successful drag, browsers often synthesize a click on the original tile.
  // Swallow that click, otherwise it would unexpectedly select the moved word.
  root.addEventListener('click', event => {
    if (performance.now() < blockClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  root.addEventListener('pointerdown', event => {
    if (root.dataset.view !== 'game' || event.button !== 0 || event.isPrimary === false) return;
    const tile = event.target.closest('.pool-word[data-token], .slot.filled[data-token]');
    if (!tile || tile.disabled || !root.contains(tile)) return;
    gesture = {
      pointerId: event.pointerId, source: tile, tokenId: tile.dataset.token,
      x: event.clientX, y: event.clientY, dragging: false
    };
    try { tile.setPointerCapture(event.pointerId); } catch { /* Some browsers do not support capture. */ }
  });

  function targetAt(x, y) {
    const hit = document.elementFromPoint(x, y);
    if (!hit || !root.contains(hit)) return { descriptor: null, element: null };
    const descriptor = resolveDropTarget(hit);
    if (!descriptor) return { descriptor: null, element: null };
    const element = descriptor.kind === 'slot'
      ? hit.closest('.slot[data-lane][data-slot]:not([disabled])')
      : hit.closest('.pile');
    return { descriptor, element };
  }

  root.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    if (!gesture.dragging && !dragDistanceReached(gesture.x, gesture.y, event.clientX, event.clientY)) return;
    if (!gesture.dragging) {
      gesture.dragging = true;
      const bounds = gesture.source.getBoundingClientRect();
      ghost = document.createElement('div');
      ghost.className = 'drag-ghost';
      ghost.textContent = gesture.source.dataset.token
        ? (gesture.source.querySelector('span')?.textContent || gesture.source.textContent).trim()
        : gesture.source.textContent.trim();
      ghost.style.width = Math.max(68, Math.min(bounds.width, 190)) + 'px';
      ghost.setAttribute('aria-hidden', 'true');
      document.body.append(ghost);
      gesture.source.classList.add('drag-origin');
      root.classList.add('drag-active');
    }
    event.preventDefault();
    ghost.style.left = event.clientX + 'px';
    ghost.style.top = (event.clientY - 32) + 'px';
    const target = targetAt(event.clientX, event.clientY).element;
    if (target !== highlighted) {
      highlighted?.classList.remove('drag-target');
      highlighted = target;
      highlighted?.classList.add('drag-target');
    }
  });

  root.addEventListener('pointerup', event => {
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const { dragging, tokenId } = gesture;
    const destination = dragging ? targetAt(event.clientX, event.clientY).descriptor : null;
    if (dragging) blockClickUntil = performance.now() + 420;
    cancelDrag();
    if (destination) onDrop(tokenId, destination);
  });

  root.addEventListener('pointercancel', cancelDrag);
  window.addEventListener('blur', cancelDrag);
  return cancelDrag;
}
