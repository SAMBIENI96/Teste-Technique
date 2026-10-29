<?php

namespace App\Enums;

enum SlotStatus: string
{
    case Available = 'available';
    case Booked = 'booked';
}
