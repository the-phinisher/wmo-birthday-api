const sendJSON = (req, res, obj) => {
  res.setHeader("statusCode", 200)
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(obj))
}

const sendInvalid = (req, res, text = null) => {
  res.writeHead(400)
  if (text) return res.end(text)
  return res.end("Invalid request")
}

module.exports = {
  sendJSON,
  sendInvalid
}
