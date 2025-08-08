// config.js

// STEP 1: Choose environment
const ENV = "test"; // Change to "live" when needed

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
    crm_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8RmYsk-sUDiHF6t4Xfaj9Gzr0FaCvhurkDTV0bd-gJgqS8drz-warzxfgIyuchSPd4vpMeDkyw8tX/pub?gid=0&single=true&output=csv",
    sheetId: "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU",
    apiKey: "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE",
    testimonial_sheet_id: "",
    followup_proxy_url: "",
    newsletter_submit: "",
    combo_sheetId: "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU", // Use live Sheet ID
    combo_apiKey: "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE",
    deal_sheetId: "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU",
    deal_apiKey: "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE",
    popup_sheet_url: "",
    tickerSheetId: "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU",
    tickerApiKey: "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE",
    megaSaleSheetId: "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU",
    megaSaleApiKey: "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE",
    razorpay_key: "rzp_live_s9MPozpmKsY792"
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
    crm_url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSM-E2RF5CrUrCcyhSr5SFwHQ52CwPYjhfNtweL0IszbSXz9rR0mj0gs1DCCORj41kZawqsKVPmi7m7/pub?gid=0&single=true&output=csv",
    sheetId: "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI",
    apiKey: "AIzaSyBxDzAHIF_EghHtJs6LxYUJL_vaWV9kJNo",
    testimonial_sheet_id: "19hdWhlLDz7dsGlCwY87j4CLj4DaH4LGpD64u2StivDs",
    followup_proxy_url: "https://script.google.com/macros/s/AKfycbzT24BfbjJ8xD051REQIR6fsUZuTiEGCqCYE40ciJtUaQTO0Q9K7LsTyj2BB8kPKOvBaQ/exec?action=sendFollowup",
    newsletter_submit: "https://script.google.com/macros/s/AKfycbyfzStlctq5hPRlwtOXyBPrzNdp3F_zDOe_3Yff4k25dv0v_Efo2TlbFqvDGzNZjcMO_Q/exec",
    combo_sheetId: "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI",
    combo_apiKey: "AIzaSyBxDzAHIF_EghHtJs6LxYUJL_vaWV9kJNo",
    deal_sheetId: "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI",
    deal_apiKey: "AIzaSyBxDzAHIF_EghHtJs6LxYUJL_vaWV9kJNo",
    popup_sheet_url: "https://docs.google.com/spreadsheets/d/19hdWhlLDz7dsGlCwY87j4CLj4DaH4LGpD64u2StivDs/gviz/tq?tqx=out:json&sheet=CRM Leads",
    tickerSheetId: "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI",
    tickerApiKey: "AIzaSyBxDzAHIF_EghHtJs6LxYUJL_vaWV9kJNo",
    megaSaleSheetId: "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI",
    megaSaleApiKey: "AIzaSyBxDzAHIF_EghHtJs6LxYUJL_vaWV9kJNo",
    razorpay_key: "rzp_test_iOdWWEhKlikqRy"
  }
};

// ✅ Global helpers
window.getScriptURL = function (key) {
  return CONFIG[ENV][key] || "#";
};

window.getSheetId = () => CONFIG[ENV].sheetId;
window.getApiKey = () => CONFIG[ENV].apiKey;

window.getTestimonialSheetId = () => CONFIG[ENV].testimonial_sheet_id;

window.getFollowupProxyURL = () => CONFIG[ENV].followup_proxy_url;

window.getNewsletterSubmitURL = () => CONFIG[ENV].newsletter_submit;

window.getComboSheetId = () => CONFIG[ENV].combo_sheetId;
window.getComboApiKey = () => CONFIG[ENV].combo_apiKey;

window.getDealSheetId = () => CONFIG[ENV].deal_sheetId;
window.getDealApiKey = () => CONFIG[ENV].deal_apiKey;

window.getPopupSheetURL = () => CONFIG[ENV].popup_sheet_url;

window.getTickerSheetId = () => CONFIG[ENV].tickerSheetId;
window.getTickerApiKey = () => CONFIG[ENV].tickerApiKey;

window.getMegaSaleSheetId = () => CONFIG[ENV].megaSaleSheetId;
window.getMegaSaleApiKey = () => CONFIG[ENV].megaSaleApiKey;

window.getRazorpayKey = () => CONFIG[ENV].razorpay_key;