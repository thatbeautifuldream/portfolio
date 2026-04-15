export const dateFormatterLong = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const dateFormatterShort = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
})

export const dateFormatterMonthYear = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
})

export const dateFormatterFull = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
})

export const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
})
