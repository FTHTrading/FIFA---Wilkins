import { Controller, Get, Post, Put, Param, Query, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { ClaimBadgeDto, RedeemCouponDto } from './dto/campaign-actions.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  // ─── Campaigns ─────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List active sponsor campaigns' })
  @ApiQuery({ name: 'eventId', required: true })
  @ApiQuery({ name: 'placement', required: false })
  @ApiQuery({ name: 'lang', required: false })
  getActive(
    @Query('eventId') eventId: string,
    @Query('placement') placement?: string,
    @Query('lang') language?: string,
  ) {
    return this.campaignsService.getActiveCampaigns(eventId, placement, language);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'SPONSOR_MANAGER')
  @ApiOperation({ summary: 'Create a new sponsor campaign (admin)' })
  createCampaign(@Body() body: CreateCampaignDto) {
    return this.campaignsService.createCampaign({
      ...body,
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      endsAt: body.endsAt ? new Date(body.endsAt) : undefined,
    });
  }

  @Post(':id/impression')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Record a campaign impression' })
  impression(@Param('id') id: string) {
    return this.campaignsService.recordImpression(id);
  }

  @Post(':id/click')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Record a campaign click' })
  click(@Param('id') id: string) {
    return this.campaignsService.recordClick(id);
  }

  // ─── Rewards & Badges ──────────────────────────────────────────────────────

  @Get('badges')
  @ApiOperation({ summary: 'List active reward badges for an event' })
  @ApiQuery({ name: 'eventId', required: true })
  getBadges(@Query('eventId') eventId: string) {
    return this.campaignsService.getActiveBadges(eventId);
  }

  @Post('badges/:badgeId/claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Claim a reward badge for a guest session' })
  claimBadge(
    @Param('badgeId') badgeId: string,
    @Body() body: ClaimBadgeDto,
  ) {
    return this.campaignsService.claimBadge(body.sessionId, body.eventId, badgeId);
  }

  @Get('rewards/session')
  @ApiOperation({ summary: 'Get points balance and earned badges for a session' })
  @ApiQuery({ name: 'sessionId', required: true })
  @ApiQuery({ name: 'eventId', required: true })
  getSessionRewards(
    @Query('sessionId') sessionId: string,
    @Query('eventId') eventId: string,
  ) {
    return this.campaignsService.getSessionPoints(sessionId, eventId);
  }

  // ─── Challenges ────────────────────────────────────────────────────────────

  @Get('challenges')
  @ApiOperation({ summary: 'List active sponsor challenges' })
  @ApiQuery({ name: 'eventId', required: true })
  getChallenges(@Query('eventId') eventId: string) {
    return this.campaignsService.getActiveChallenges(eventId);
  }

  @Post('coupons/redeem')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redeem a coupon code' })
  redeemCoupon(@Body() body: RedeemCouponDto) {
    return this.campaignsService.recordCouponRedemption(
      body.sessionId,
      body.eventId,
      body.couponCode,
      body.campaignId,
      body.challengeId,
    );
  }
}

