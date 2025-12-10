import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { IconButton } from '@/components/ui/IconButton';
import { Header } from '@/components/ui/Header';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ChevronLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TestComponents = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Test Components" />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 32 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Buttons</Text>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button isLoading>Loading</Button>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Inputs</Text>
          <Input label="Your Name" placeholder="John Doe" />
          <Input
            label="Your Email"
            placeholder="john@doe.com"
            error="This email is invalid."
          />
          <Input
            label="Password"
            placeholder="********"
            secureTextEntry
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Cards</Text>
          <Card>
            <Text>Default Card</Text>
          </Card>
          <Card variant="outlined">
            <Text>Outlined Card</Text>
          </Card>
          <Card variant="elevated">
            <Text>Elevated Card</Text>
          </Card>
        </View>

        <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Avatars</Text>
          <Avatar
            source={{ uri: 'https://github.com/bruno-camargo.png' }}
            size="sm"
          />
          <Avatar
            source={{ uri: 'https://github.com/bruno-camargo.png' }}
            size="md"
          />
          <Avatar
            source={{ uri: 'https://github.com/bruno-camargo.png' }}
            size="lg"
          />
          <Avatar
            source={{ uri: 'https://github.com/bruno-camargo.png' }}
            size="xl"
          />
          <Avatar size="lg" />
        </View>

        <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Badges</Text>
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="pro">Pro</Badge>
        </View>

        <View style={{ gap: 8, flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Icon Buttons</Text>
          <IconButton icon={ChevronLeft} />
          <IconButton icon={ChevronLeft} variant="primary" />
          <IconButton icon={ChevronLeft} variant="ghost" />
          <IconButton icon={ChevronLeft} size="lg" />
        </View>

        <View style={{ height: 200, borderWidth: 1, borderColor: '#ccc' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Loading Screen</Text>
          <LoadingScreen />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestComponents;
