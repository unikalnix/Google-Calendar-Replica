import { Calendar, ArrowRight, Share2, Bell } from "lucide-react"
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 md:px-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 text-balance">
              Your calendar, <br />
              <span className="text-blue-600">simplified</span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 text-pretty">
              Manage your events, share calendars, and stay organized with our modern, clean interface designed for
              productivity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => {
                navigate('/login')
              }} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => {
                navigate('/login?auth=signin')
              }}  className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                Sign In
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-a9GK3QdHSs4ABa5HR683kWqzdTZG3Q.png"
                alt="Calendar interface mockup"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16 text-balance">
            Everything you need to stay organized
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Multiple Views */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Views</h3>
              <p className="text-gray-600 text-pretty">
                Switch between month, week, and day views to see your schedule exactly how you want it.
              </p>
            </div>

            {/* Easy Sharing */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Sharing</h3>
              <p className="text-gray-600 text-pretty">
                Share calendars with family, friends, or colleagues with customizable permissions and access levels.
              </p>
            </div>

            {/* Smart Reminders */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Reminders</h3>
              <p className="text-gray-600 text-pretty">
                Never miss an important event with customizable reminders and notifications delivered just when you need
                them.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Home
