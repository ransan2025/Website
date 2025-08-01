// config.js

// STEP 1: Choose environment
const ENV = "live"; // Change to "test" when needed

// STEP 2: Define URLs per environment
const CONFIG = {
  live: {
    admin_dashboard: "https://script.google.com/macros/s/AKfycbwv65EQKsSnUWOaxD8i0-zqnxuBRypeZN8Nir-jIszbc9lqiDvq3IHnMsQ-uR15k3SZ/exec",
    admin_leads: "https://script.google.com/macros/s/AKfycbxFX-rVFLtHUlwrZVJxu6ZhZk25oKPUYqT6cLo2j359fe_BndAg6BjOvGz6Y1R9R4wqBw/exec",
    estore_payment: "https://script.google.com/macros/s/AKfycbxYnypoWta9wv27RDEi_iPI_ISn3ZeRCW-RW_bNW8h3YBysU5HPtu1BGekR2-yhUytkaQ/exec",
    invoice_generation: "https://script.google.com/macros/s/AKfycbzswQFu7aSP_JQN4bKh-4MOXxo77dLcMDAL-lc8HJK7TN-oCaqHr4B1i2UXkFrzCbV4/exec",
    whatsapp_followup: "https://script.google.com/macros/s/AKfycbzT24BfbjJ8xD051REQIR6fsUZuTiEGCqCYE40ciJtUaQTO0Q9K7LsTyj2BB8kPKOvBaQ/exec",
    enquiry: "https://script.google.com/macros/s/AKfycbztBuNOixSYEGWjdkMVTrzUQGo8OQTFtXW8kd8WQn17fhC4WgQ792-xqr2PJfUToDEl/exec",
    contact: "https://script.google.com/macros/s/AKfycbxqbr_sHRmqW-1pHpKauOCKlI_hdXn8PXPQieVrvGLPgKdES1hXEo3t_7K2fECkbW75/exec",
    popup: "https://script.google.com/macros/s/AKfycbzJDA5leOaZ0nRrJVLxKATfPwqs5lX-AazsK4dWyP2yNXFBfp4u5pzAcDpUoc7YbnVu4Q/exec",
	newsletter_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8RmYsk-sUDiHF6t4Xfaj9Gzr0FaCvhurkDTV0bd-gJgqS8drz-warzxfgIyuchSPd4vpMeDkyw8tX/pub?gid=255856917&single=true&output=csv",
    crm_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8RmYsk-sUDiHF6t4Xfaj9Gzr0FaCvhurkDTV0bd-gJgqS8drz-warzxfgIyuchSPd4vpMeDkyw8tX/pub?gid=0&single=true&output=csv"
  },
  test: {
    admin_dashboard: "https://script.google.com/macros/s/AKfycbxqJ2Jby87CEW5oJOeaDUrSHE5wsdi8YsTaXb0n0Jn_dhtWc_C9oE-zKUAzTgQlub1O/exec",
    admin_leads: "https://script.google.com/macros/s/AKfycbz8dycSFT-TzlCDDQoJhNMtN7Bc9KXR46WxiiaCH2-hrNqvVDjWgLCAtAGmwkBurQc8cA/exec",
    estore_payment: "https://script.google.com/macros/s/AKfycbwE5KLVVS7LF0lui7nVrpiEVzSOt_eEXDTfrSWCoRFN87k7s_1yfeYqcTc5gERjkK1UQQ/exec",
    invoice_generation: "https://script.google.com/macros/s/AKfycbyQmJMeZ8gviOULbf7I345gS2Beg7Y4NZRcM4nNOHO5Vk-yZ3lZb85uqEMrbrIcZuMY/exec",
    whatsapp_followup: "#",
    enquiry: "https://script.google.com/macros/s/AKfycbxWFxGxQvhLPGNVTmGWpiBOeuRKwJvdK5B4LqbuaqURuOPAvDc5hMbRGR7nO_o-EJTheQ/exec",
    contact: "https://script.google.com/macros/s/AKfycbw4yAuaL4zl05Q_OTsnD2DZh178tgy1kCWAKnJ9pwkI2tH0-ZuDmTmuTFSoKo8t-nB_9A/exec",
    popup: "https://script.google.com/macros/s/AKfycbxIG-xEML9ozfheP5__hjb0JvKwRhKPpVqDPAXgujKJKuepXfwhYeL1KdgDAIEtMA/exec",
	newsletter_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM-E2RF5CrUrCcyhSr5SFwHQ52CwPYjhfNtweL0IszbSXz9rR0mj0gs1DCCORj41kZawqsKVPmi7m7/pub?gid=0&single=true&output=csv",
    crm_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM-E2RF5CrUrCcyhSr5SFwHQ52CwPYjhfNtweL0IszbSXz9rR0mj0gs1DCCORj41kZawqsKVPmi7m7/pub?gid=0&single=true&output=csv"
  }
};

// Declare globally so you can use in any JS file
window.getScriptURL = function (key) {
  return CONFIG[ENV][key] || "#";
};
