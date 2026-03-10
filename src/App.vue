<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans space-y-8">
    
    <!-- Contact Form -->
    <div class="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div class="bg-indigo-600 px-6 py-8 text-center text-white relative">
        <div class="absolute inset-0 bg-indigo-700 opacity-20 transform -skew-y-3"></div>
        <h2 class="text-3xl font-extrabold mb-2 relative z-10">Alet test</h2>
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

          <div>
            <label for="phone" class="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              id="phone" 
              required
              class="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
              placeholder="+1234567890"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
          >
            <span v-if="isSubmitting" class="inline-block animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></span>
            {{ isSubmitting ? 'Saving...' : 'Submit to DB' }}
          </button>
        </form>

        <transition name="fade">
          <div v-if="message" class="mt-6 text-center text-sm font-medium p-3 rounded-lg" :class="isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
            {{ message }}
          </div>
        </transition>
      </div>
    </div>

    <!-- MongoDB Records Table -->
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6">
      <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">Registered Users</h3>
      
      <div v-if="users.length === 0" class="text-center text-gray-500 py-4">
        No users found in Database.
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in users" :key="user._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ user.phone }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex justify-center">
        <button 
          @click="fetchUsers"
          :disabled="isFetching"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 shadow hover:shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-95"
        >
          <span v-if="isFetching" class="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
          Refresh Database
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const isSubmitting = ref(false)
const isFetching = ref(false)
const message = ref('')
const isSuccess = ref(false)
const users = ref([])

const fetchUsers = async () => {
  isFetching.value = true
  try {
    const response = await fetch('http://localhost:3000/api/users')
    if (response.ok) {
      users.value = await response.json()
    }
  } catch (error) {
    console.error("Failed to fetch users", error)
  } finally {
    isFetching.value = false
  }
}

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
    
    // Parse the JSON data from both success or error response
    const data = await response.json()
    
    if (response.ok) {
      isSuccess.value = true
      message.value = data.message || 'Success!'
      form.name = ''
      form.email = ''
      form.phone = ''
      
      // Refresh the table with new data (temporarily disabled)
      // await fetchUsers()
    } else {
      isSuccess.value = false
      message.value = data.message || 'Failed to save data. Please try again.'
    }
  } catch (error) {
    isSuccess.value = false
    message.value = 'Network error. Please make sure the backend server (and MongoDB) is running.'
  } finally {
    isSubmitting.value = false
    
    setTimeout(() => {
      message.value = ''
    }, 5000)
  }
}

onMounted(() => {
  fetchUsers()
})
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
