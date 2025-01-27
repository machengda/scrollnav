/*
 * scrollnav
 * http://scrollnav.com
 *
 * Copyright (c) 2013-2018 James Wilson
 * Licensed under the MIT license.
 */

import setupClickHandlers from './setupClickHandlers';
import setupResizeHandler from './setupResizeHandler';
import setupScrollHandler from './setupScrollHandler';
import teardownClickHandlers from './teardownClickHandlers';
import teardownResizeHandler from './teardownResizeHandler';
import teardownScrollHandler from './teardownScrollHandler';
import createNav from './util/createNav';
import extend from './util/extend';
import insertNav from './util/insertNav';
import insertVisualDebugger from './util/insertVisualDebugger';
import populateSectionData from './util/populateSectionData';
import updatePositionData from './util/updatePositionData';

let clickHandler;
let scrollHandler;
let resizeHandler;

function isElement(element) {
  return element instanceof Element;
}

function init(elem, options) {
  const defaults = {
    sections: 'h2',
    insertTarget: elem,
    insertLocation: 'before',
    easingStyle: 'easeOutQuad',
    updateHistory: true
  };
  this.settings = extend(defaults, options);
  const locationOptions = ['append', 'prepend', 'after', 'before'];

  if (!isElement(elem)) {
    if (this.settings.debug) {
      // eslint-disable-next-line no-console
      console.error(`
        scrollnav build failed, content argument "${elem}" is not an HTML Element
      `);
    }
    return;
  }

  if (this.settings.insertTarget && !isElement(this.settings.insertTarget)) {
    if (this.settings.debug) {
      // eslint-disable-next-line no-console
      console.error(`
        scrollnav build failed, options.insertTarget "${elem}" is not an HTML Element
      `);
    }
    return;
  }

  if (!locationOptions.includes(this.settings.insertLocation)) {
    if (this.settings.debug) {
      // eslint-disable-next-line no-console
      console.error(`
        scrollnav build failed, options.insertLocation "${
          this.settings.insertLocation
        }" is not a valid option
      `);
    }
    return;
  }

  const sectionsDom = elem.querySelectorAll(this.settings.sections);

  if (!sectionsDom.length) {
    if (this.settings.debug) {
      // eslint-disable-next-line no-console
      console.error(`
        scrollnav build failed, could not find any "${this.settings.sections}"
        elements inside of "${elem}"
      `);
    }
    return;
  }

  this.data = populateSectionData(sectionsDom, this.settings);
  this.nav = createNav(this.data);

  insertNav(this);
  clickHandler = setupClickHandlers(this);
  scrollHandler = setupScrollHandler(this);
  resizeHandler = setupResizeHandler(this);

  if (this.settings.debug) insertVisualDebugger();
  if (this.settings.onInit) return this.settings.onInit();
  return this;
}

function destroy(options) {
  this.settings = extend(this.settings, options);

  teardownClickHandlers(this.nav, clickHandler);
  teardownScrollHandler(scrollHandler);
  teardownResizeHandler(resizeHandler);
  this.nav.remove();

  if (this.settings.onDestroy) return this.settings.onDestroy();
}

function updatePositions(options) {
  this.settings = extend(this.settings, options);
  this.data = updatePositionData(this.data);

  if (this.settings.onUpdatePositions) return this.settings.onUpdatePositions();
}

const scrollnav = {
  init: init,
  destroy: destroy,
  updatePositions: updatePositions
};

export default scrollnav;
