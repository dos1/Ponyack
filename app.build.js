({
  name: "main",
  out: "main-built.js",
  baseUrl: ".",
  include: ["libs/require"],
  uglify: {
    max_line_length: 1000
  }
})
