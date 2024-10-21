"use client";

export function setCookie(name, value) {
  window.localStorage.setItem(name, JSON.stringify({ value }));
}

export function getCookie(name) {
  try {
    return JSON.parse(window.localStorage.getItem(name)).value;
  } catch (e) {
    return null;
  }
}

export function deleteCookie(name) {
  window.localStorage.removeItem(name);
  return "ok";
}