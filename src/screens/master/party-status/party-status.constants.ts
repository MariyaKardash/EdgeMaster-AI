import type { PartyPlayer } from '@/components/molecules/party-player-card';

export const PARTY_STATUS_SCREEN_TITLE = 'Party Overview';

export const MOCK_PARTY_PLAYERS: PartyPlayer[] = [
  {
    id: 'kaelen-vance',
    name: 'Kaelen Vance',
    race: 'Human',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACtP_BRHt2f3W5oTOQ1K7PIR73hxUx6tXaNsIyhaK02KfuEGv8hmk3V19NabH_UEi_8YxkaAccyt6fGdsu4vrX6lVIoAbnw0cpV_gQA7P4gpFd0VFm0lf01TVYsFnMj9acyBZsGxxJrRf8zMZkhK5ITBZjrJc-50eZKvfFVwBSMLWsxI6urf0BPAcxG8Jd3eoddsf7y82YLgf7c-thv5P6nPXwdn-KXFdP7eXMaYFbHtKH0eaus_g4lYMzcuXgC1wU5kPE3wz2V5g',
    hp: { current: 45, max: 45 },
    stats: { str: 16, dex: 14, int: 10 },
    equippedItems: [
      { id: 'sun-forged-blade', name: 'Sun-Forged Blade', icon: 'whatshot' },
      { id: 'wardens-plate', name: "Warden's Plate", icon: 'shield' },
      { id: 'greater-healing-potion', name: 'Greater Healing Potion', icon: 'science' },
    ],
  },
  {
    id: 'lyra-moonwhisper',
    name: 'Lyra Moonwhisper',
    race: 'Elf',
    imageUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCX9x2jNkZmtsqEhenBGuMG24eXl8dsl_AEtUEol8DYHn9qRDCnh51cd3Cjnn-VYW6558CR24HaojWDUT8XHIITwh-3iLhdtFRHDiODAD0OgDbeSMUqN78p1_2BmMmbVuGluthX-Jl9dJ0xhIXgmDP0iROdNOF3RMjgG2nZ7jbinkM4ZIpMumJwBr7MSJy3G_UoOWO82uXbdQUPVx9PB7dAXnwjHr5vziFpw82oJQRT1I2WF1RJofLVUo_P5Z_9YJpfm96GnD40VSE',
    hp: { current: 12, max: 24 },
    stats: { str: 8, dex: 12, int: 18 },
    equippedItems: [
      { id: 'staff-of-the-moon', name: 'Staff of the Moon', icon: 'auto-stories' },
      { id: 'amulet-of-vitality', name: 'Amulet of Vitality', icon: 'flash-on' },
    ],
  },
];
