import { Link } from 'react-router-dom';
import { Users, CalendarCheck, TrendingUp, ArrowRight, GraduationCap, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Home = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '--',
      description: 'Registered in system',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: "Today's Attendance",
      value: '--',
      description: 'Records marked today',
      icon: CalendarCheck,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Attendance Rate',
      value: '--%',
      description: 'Overall presence rate',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Students',
      description: 'Add, edit, or remove students from your roster',
      icon: Users,
      link: '/students',
      color: 'bg-primary',
    },
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance for your students',
      icon: CalendarCheck,
      link: '/attendance',
      color: 'bg-success',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-success/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Student Attendance Tracker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Track Attendance with{' '}
              <span className="text-primary">Ease</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              A modern, intuitive solution for managing student attendance. 
              Add students, mark attendance, and monitor participation effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="gap-2">
                <Link to="/students">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/attendance">Mark Attendance</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="stat-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Quick Actions</h2>
          <p className="text-muted-foreground">Get started with these common tasks</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={action.title}
                className="group hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription className="text-base">{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="gap-2 p-0 h-auto text-primary hover:text-primary/80">
                    <Link to={action.link}>
                      Go to {action.title.toLowerCase()}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Real-time Tracking</h3>
                <p className="text-sm text-muted-foreground">Connect to your backend API for live data</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Configure <code className="px-2 py-1 bg-muted rounded text-foreground">VITE_API_URL</code> in your .env file
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
