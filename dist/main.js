const initXphone = (vm) => {
  const phone = new XPhone()
  /* Call to echo-test */
  phone.onOpen = () => {
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

  /* Destroying the call */
  phone.onDestroy = call => {
    console.log("destroy", call)
  }
  return phone
}

const app = new Vue({
  el: '#app',
  data: {
    phoneNumber: 200,
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
      login: "1119837",
      password: "bf00ffae99aa22e5f4d568554e13b92a"
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
    closeCall(line) {
      this.$phone.finishCall(line)
      this.calls =  this.calls.filter(c => c.line !== line)
    }
  }
})


