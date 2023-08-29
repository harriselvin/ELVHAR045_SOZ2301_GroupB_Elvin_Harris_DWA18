import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ukxwswxojscnzkirerwo.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVreHdzd3hvanNjbnpraXJlcndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMyMTE5NTksImV4cCI6MjAwODc4Nzk1OX0.BcVYkzEPzzxAqDXJxPAGWYQlUK4InxnpXXkiaaOabn8"
);

/**
 * this function returns a stringed date
 * @param {*} date - is the date
 * @returns {string}
 */

export const formalDate = (date) => {
  const months = [
    "January",
    "febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = new Date(date).getDate();
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();

  const sentence = ` ${day} ${months[month - 1]}, ${year} `;
  return sentence;
};
