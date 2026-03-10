<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div class="bg-indigo-600 px-6 py-8 text-center text-white relative">
        <div class="absolute inset-0 bg-indigo-700 opacity-20 transform -skew-y-3"></div>
        <h2 class="text-3xl font-extrabold mb-2 relative z-10">Get in Touch</h2>
        <p class="text-indigo-200 text-sm relative z-10">We'd love to hear from you.</p>
      </div>
      
      <div class="p-8">
        <form @submit.prevent="submitForm" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              id="name" 
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              placeholder="John Doe"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input 
              v-model="form.email" 
              type="email" 
              id="email" 
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              placeholder="john@example.com"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            <span v-if="isSubmitting" class="inline-block animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            {{ isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>

        <transition name="fade">
          <div v-if="message" class="mt-6 text-center text-sm font-medium p-3 rounded-lg" :class="isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ message }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const form = reactive({
  name: '',
  email: ''
})

const isSubmitting = ref(false)
const message = ref('')
const isSuccess = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  message.value = ''
  
  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form)
    })
    
    if (response.ok) {
      isSuccess.value = true
      message.value = 'Email sent successfully!'
      form.name = ''
      form.email = ''
    } else {
      isSuccess.value = false
      const data = await response.json()
      message.value = data.message || 'Failed to send email. Please try again.'
    }
  } catch (error) {
    isSuccess.value = false
    message.value = 'Network error. Please make sure the backend server as running.'
  } finally {
    isSubmitting.value = false
    
    // Clear message after 5 seconds
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
