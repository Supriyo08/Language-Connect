import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, Gift, Copy, Share2, Trophy, Users, Ticket, Crown, Medal, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface ReferralStats {
  userId: string;
  userName: string;
  referralId: string;
  totalReferrals: number;
  ticketsEarned: number;
  rank: number;
}

interface Prize {
  id: string;
  name: string;
  description: string;
  ticketsRequired: number;
  imageUrl: string;
  available: number;
}

export default function Referrals() {
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [referralStats, setReferralStats] = useState<ReferralStats[]>([]);
  const [userStats, setUserStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [prizes] = useState<Prize[]>([
    {
      id: "1",
      name: "LanguageKonnect Premium (1 Year)",
      description: "Access to premium features, advanced analytics, and exclusive content",
      ticketsRequired: 50,
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop",
      available: 10
    },
    {
      id: "2", 
      name: "Language Learning Course Bundle",
      description: "Complete online courses for Spanish, French, and German",
      ticketsRequired: 30,
      imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop",
      available: 25
    },
    {
      id: "3",
      name: "Wireless Headphones",
      description: "High-quality noise-cancelling headphones perfect for language practice",
      ticketsRequired: 25,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
      available: 15
    },
    {
      id: "4",
      name: "Language Exchange Trip",
      description: "3-day language immersion experience in Barcelona, Spain",
      ticketsRequired: 100,
      imageUrl: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&h=200&fit=crop",
      available: 2
    },
    {
      id: "5",
      name: "LanguageKonnect Merchandise Kit",
      description: "T-shirt, notebook, and branded language learning accessories",
      ticketsRequired: 10,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
      available: 50
    }
  ]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      // Mock referral leaderboard data
      const mockReferralStats: ReferralStats[] = [
        {
          userId: "1",
          userName: "Alex Rivera",
          referralId: "LK-ALEX2024",
          totalReferrals: 28,
          ticketsEarned: 28,
          rank: 1
        },
        {
          userId: "2",
          userName: "Maria Santos",
          referralId: "LK-MARIA789",
          totalReferrals: 22,
          ticketsEarned: 22,
          rank: 2
        },
        {
          userId: "3",
          userName: "David Kim",
          referralId: "LK-DAVID456",
          totalReferrals: 19,
          ticketsEarned: 19,
          rank: 3
        },
        {
          userId: "4",
          userName: "Sophie Chen",
          referralId: "LK-SOPHIE123",
          totalReferrals: 15,
          ticketsEarned: 15,
          rank: 4
        },
        {
          userId: "5",
          userName: "James Wilson",
          referralId: "LK-JAMES999",
          totalReferrals: 12,
          ticketsEarned: 12,
          rank: 5
        }
      ];

      // Add user to leaderboard if authenticated
      if (isAuthenticated && user) {
        const existingUserIndex = mockReferralStats.findIndex(stat => stat.userName === user.name);
        
        if (existingUserIndex === -1) {
          // Add new user with some random stats
          const userReferrals = Math.floor(Math.random() * 10) + 1; // 1-10 referrals
          const newUserStats: ReferralStats = {
            userId: user.id,
            userName: user.name,
            referralId: user.referralId,
            totalReferrals: userReferrals,
            ticketsEarned: userReferrals,
            rank: 0 // Will be calculated after sorting
          };
          mockReferralStats.push(newUserStats);
        }
      }

      // Sort by total referrals and assign ranks
      mockReferralStats.sort((a, b) => b.totalReferrals - a.totalReferrals);
      const rankedStats = mockReferralStats.map((stat, index) => ({
        ...stat,
        rank: index + 1
      }));

      setReferralStats(rankedStats);

      // Set user stats if authenticated
      if (isAuthenticated && user) {
        const currentUserStats = rankedStats.find(stat => stat.userName === user.name);
        setUserStats(currentUserStats || null);
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast({
        title: "Error",
        description: "Failed to load referral data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralData();
  }, [user, isAuthenticated]);

  const copyReferralLink = async () => {
    if (!user) return;
    
    const referralLink = `${window.location.origin}/signup?ref=${user.referralId}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard",
      });
    }
  };

  const shareReferralLink = async () => {
    if (!user) return;
    
    const referralLink = `${window.location.origin}/signup?ref=${user.referralId}`;
    const shareData = {
      title: 'Join LanguageKonnect!',
      text: 'Connect with language learners worldwide and join amazing contests!',
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copy
        copyReferralLink();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-semibold">#{rank}</span>;
  };

  const getPrizeProgressColor = (ticketsEarned: number, ticketsRequired: number) => {
    const percentage = (ticketsEarned / ticketsRequired) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-yellow-500";
    if (percentage >= 50) return "bg-blue-500";
    return "bg-gray-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-50/30 to-blue-50/30">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LanguageKonnect
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/contests">
                <Button variant="ghost" aria-label="Go to contests">Contests</Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" aria-label="Go to leaderboard">Leaderboard</Button>
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Welcome, </span>
                    <span className="font-medium">{user?.name}</span>
                  </div>
                  <Button variant="outline" onClick={logout} aria-label="Logout">
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="outline" aria-label="Login to LanguageKonnect">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-green-600 mr-3" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Referrals & Rewards
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Invite friends to LanguageKonnect and earn raffle tickets for amazing prizes!
            </p>
          </div>

          {isAuthenticated && user ? (
            <>
              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="pt-6 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-700">
                      {userStats?.totalReferrals || 0}
                    </div>
                    <div className="text-green-600">Referrals Made</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="pt-6 text-center">
                    <Ticket className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-700">
                      {userStats?.ticketsEarned || 0}
                    </div>
                    <div className="text-blue-600">Raffle Tickets</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="pt-6 text-center">
                    <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-700">
                      #{userStats?.rank || 'N/A'}
                    </div>
                    <div className="text-purple-600">Your Rank</div>
                  </CardContent>
                </Card>
              </div>

              {/* Referral Link Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Your Referral Link
                  </CardTitle>
                  <CardDescription>
                    Share this link with friends to earn raffle tickets when they sign up!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="referralId">Your Referral ID:</Label>
                      <Badge variant="secondary" className="font-mono text-lg px-3 py-1">
                        {user.referralId}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/signup?ref=${user.referralId}`}
                        className="font-mono text-sm"
                        aria-label="Your referral link"
                      />
                      <Button onClick={copyReferralLink} variant="outline" aria-label="Copy referral link">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button onClick={shareReferralLink} aria-label="Share referral link">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">🎉 How it works:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Share your unique referral link with friends</li>
                        <li>• When they sign up using your link, you both earn rewards</li>
                        <li>• Collect raffle tickets to enter prize drawings</li>
                        <li>• Climb the leaderboard and compete for daily prizes</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prizes Section */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="w-5 h-5" />
                    Available Prizes
                  </CardTitle>
                  <CardDescription>
                    Use your raffle tickets to win amazing prizes!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prizes.map((prize) => {
                      const userTickets = userStats?.ticketsEarned || 0;
                      const canAfford = userTickets >= prize.ticketsRequired;
                      const progress = Math.min((userTickets / prize.ticketsRequired) * 100, 100);
                      
                      return (
                        <Card key={prize.id} className={`overflow-hidden ${canAfford ? 'ring-2 ring-green-500' : ''}`}>
                          <div className="aspect-video relative">
                            <img 
                              src={prize.imageUrl} 
                              alt={prize.name}
                              className="w-full h-full object-cover"
                            />
                            {canAfford && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-green-500 text-white">Available!</Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2">{prize.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {prize.description}
                            </p>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress:</span>
                                <span className="font-medium">
                                  {userTickets}/{prize.ticketsRequired} tickets
                                </span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="text-xs">
                                  {prize.available} left
                                </Badge>
                                <Button 
                                  size="sm" 
                                  disabled={!canAfford}
                                  aria-label={`Enter raffle for ${prize.name}`}
                                >
                                  {canAfford ? "Enter Raffle" : `Need ${prize.ticketsRequired - userTickets} more`}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="text-center py-12 mb-8">
              <CardContent>
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Login to Access Referrals</h3>
                <p className="text-muted-foreground mb-6">
                  Create an account to get your unique referral link and start earning rewards!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/signup">
                    <Button size="lg">Sign Up Now</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">Login</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Referral Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Daily Referral Leaderboard
              </CardTitle>
              <CardDescription>
                Top referrers earn bonus prizes and recognition!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 animate-pulse">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/4"></div>
                      </div>
                      <div className="h-8 bg-muted rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {referralStats.slice(0, 10).map((stat) => (
                    <div
                      key={stat.userId}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        stat.rank <= 3 ? 'bg-gradient-to-r from-primary/5 to-accent/5' : 'hover:bg-muted/50'
                      } ${user && stat.userName === user.name ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          {getRankIcon(stat.rank)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground flex items-center gap-2">
                            {stat.userName}
                            {user && stat.userName === user.name && (
                              <Badge variant="default" className="text-xs">You</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {stat.referralId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{stat.totalReferrals}</div>
                        <div className="text-sm text-muted-foreground">referrals</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Ticket className="w-3 h-3" />
                          <span>{stat.ticketsEarned}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
