const initXphone = (vm) => {
  const phone = new XPhone()
  /* Call to echo-test */
  phone.onOpen = () => {
    vm.connected = true
    console.log("Connection opened")
  }

  /* Connection closed */
  phone.onClose = () => console.log("Connection closed")

  /* Icomming call */
  phone.onCreate = call => {
    vm.calls.push(call)
    if (call.type === phone.INCOMING) {
      setTimeout(() => phone.acceptCall(call.line), 3000)
    }
  }

  /* Handling errors */
  phone.onError = error => console.log("error", error)

  /* Change the call parameters */
  phone.onChange = call => {
    console.log("change", call)
  }

  phone.onMessageIn = message => {
    vm.incomindMessage(message)
  }

  /* Get new chat message */
  phone.getMessageIn = () => {
    // console.log('message_incoming', phone.message_incoming)
  }

  /* Destroying the call */
  phone.onDestroy = call => {
    console.log("destroy", call)
  }
  return phone
}

class Message {
  constructor(name, text, token) {
    this.name = name
    this.text = text
    this.user_token = token
    this.date = this.getDate()
  }

  getDate() {
    const date = new Date()
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const [{ value: month },,{ value: day },,{ value: year },, { value: hour },, { value: minute },, { value: second }] = dateTimeFormat.formatToParts(date) 
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
}

const app = new Vue({
  el: '#app',
  data: {
    connected: false,
    phoneNumber: 200,
    message: 'Сообщение',
    messages: [],
    $phone: null,
    calls: []
  },
  computed: {
    allCals() {
      if (this.calls.length) {
        return this.calls.map(c => {
          const { line, phoneNumber, conference, type, connectDate } = c
          return { line, phoneNumber, conference, type, connectDate }
        })
      }
      return []
    }
  },
  mounted() {
    const vm = this
    this.$phone = initXphone(vm)
    this.$phone.init({
      login: "1119685",
      password: "d467cecdef7aa39f9494b1e5b5035754"
    })
  },
  methods: {
    makeCall() {
      this.$phone.makeCall(this.phoneNumber)
      this.$calls = this.$phone.getCalls().map(c => {
        const { line, phoneNumber } = c
        return {
          line, phoneNumber
        }
      })
    },
    sendMessage() {
      const message = new Message('oleh', this.message, '371989982361')

      this.$phone.sendMessage('1', 'group_386', this.message)
      this.message = ''

      this.messages.push(message)
    },
    incomindMessage(data) {
      const { sms_text, n_b} = data
      const message = new Message(n_b, sms_text, '371989982361')
      this.messages.push(message)
    },
    closeCall(line) {
      this.$phone.finishCall(line)
      this.calls =  this.calls.filter(c => c.line !== line)
    }
  }
})


