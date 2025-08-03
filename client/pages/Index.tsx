import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Users, Trophy, Gift, MessageCircle, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LanguageKonnect
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" aria-label="Login to LanguageKonnect">Login</Button>
              </Link>
              <Link to="/signup">
                <Button aria-label="Sign up for LanguageKonnect">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              🌍 Connect • Learn • Compete
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Connect with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Language Learners
              </span>{" "}
              Worldwide
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the global community where language enthusiasts connect, learn together, 
              compete in exciting challenges, and win amazing prizes through our referral program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto" aria-label="Start your language journey">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contests">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" aria-label="Explore language contests">
                  Explore Contests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Master Languages
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From personalized profiles to global competitions, we provide all the tools 
              you need for your language learning journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-blue-50/20 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Connect & Profile</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Create your personalized profile with native and target languages, 
                  experience levels, and connect with learners worldwide.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <Badge variant="secondary" className="mr-2">Profile Creation</Badge>
                  <Badge variant="secondary" className="mr-2">Language Matching</Badge>
                  <Badge variant="secondary">Video Intros</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-purple-50/20 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">Contests & Challenges</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Participate in 60-second video challenges, showcase your language skills, 
                  and climb the live leaderboards with real-time updates.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <Badge variant="secondary" className="mr-2">Video Contests</Badge>
                  <Badge variant="secondary" className="mr-2">Live Leaderboards</Badge>
                  <Badge variant="secondary">Instant Results</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-green-50/20 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Referrals & Rewards</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base leading-relaxed">
                  Earn raffle tickets by referring friends, track your progress, 
                  and compete for amazing prizes in our daily referral challenges.
                </CardDescription>
                <div className="mt-4 space-y-2">
                  <Badge variant="secondary" className="mr-2">Referral System</Badge>
                  <Badge variant="secondary" className="mr-2">Raffle Tickets</Badge>
                  <Badge variant="secondary">Daily Prizes</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Languages Supported</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Video Submissions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">$25K+</div>
              <div className="text-muted-foreground">Prizes Awarded</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What Our Community Says
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "LanguageKonnect helped me find amazing conversation partners. The video contests 
                  are so much fun and really motivate me to practice!"
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Learning Spanish</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The referral system is genius! I've earned so many raffle tickets by inviting friends. 
                  The community here is incredibly supportive."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Miguel Rodriguez</p>
                    <p className="text-sm text-muted-foreground">Learning Japanese</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "I love the competitive aspect! The leaderboards push me to create better content 
                  and really improve my pronunciation."
                </p>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-medium">Emma Thompson</p>
                    <p className="text-sm text-muted-foreground">Learning French</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of language learners from around the world. Create your profile, 
            participate in contests, and start winning today!
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-3" aria-label="Join LanguageKonnect now">
              Join LanguageKonnect Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LanguageKonnect
                </span>
              </div>
              <p className="text-muted-foreground">
                Connecting language learners worldwide through community, competition, and rewards.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/signup" className="hover:text-foreground transition-colors">Create Profile</Link></li>
                <li><Link to="/contests" className="hover:text-foreground transition-colors">Contests</Link></li>
                <li><Link to="/leaderboard" className="hover:text-foreground transition-colors">Leaderboard</Link></li>
                <li><Link to="/referrals" className="hover:text-foreground transition-colors">Referrals</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="mailto:support@languagekonnect.com" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="mailto:support@languagekonnect.com" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 LanguageKonnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
