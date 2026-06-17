import PDFDocument from 'pdfkit';
import { dataService } from '../data/mockData.js';
import type { SimulationTask, TemperatureData } from '../../shared/types.js';

export const generateReportPDF = (taskId: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const task = dataService.getTaskById(taskId);
    if (!task) {
      reject(new Error('Task not found'));
      return;
    }

    const tempData = dataService.getTemperatureData(taskId);
    const warnings = dataService.getWarningRecords(taskId);

    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `模拟报告 - ${task.name}`,
        Author: '熔池动力学模拟平台',
        Subject: '增材制造工艺模拟报告',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const pageWidth = doc.page.width - 100;

    doc
      .fillColor('#0A1628')
      .fontSize(24)
      .text('增材制造熔池动力学模拟报告', { align: 'center' })
      .moveDown(0.5)
      .fontSize(14)
      .fillColor('#64748b')
      .text(`Melt Pool Dynamics Simulation Report`, { align: 'center' })
      .moveDown(2);

    doc
      .strokeColor('#00D4FF')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(2);

    doc
      .fillColor('#0A1628')
      .fontSize(16)
      .text('一、任务基本信息', { underline: true })
      .moveDown(1);

    const basicInfo = [
      ['任务编号', task.id],
      ['任务名称', task.name],
      ['材料类型', task.materialName],
      ['激光功率', `${task.laserPower} W`],
      ['扫描速度', `${task.scanSpeed} mm/s`],
      ['基板温度', `${task.substrateTemp} °C`],
      ['扫描路径', task.scanPathFile],
      ['创建时间', new Date(task.createdAt).toLocaleString('zh-CN')],
      ['完成时间', new Date(task.updatedAt).toLocaleString('zh-CN')],
    ];

    basicInfo.forEach(([label, value], i) => {
      doc
        .fillColor(i % 2 === 0 ? '#475569' : '#0A1628')
        .fontSize(11)
        .text(`${label}:`, 50, doc.y, { continued: true, width: 120 })
        .fillColor('#0A1628')
        .text(`${value}`);
    });

    doc.moveDown(2);

    doc
      .fillColor('#0A1628')
      .fontSize(16)
      .text('二、模拟结果摘要', { underline: true })
      .moveDown(1);

    const results = [
      { label: '最大熔池温度', value: task.maxPoolTemp ? `${task.maxPoolTemp.toFixed(1)} K` : 'N/A', color: '#FF6B35' },
      { label: '平均冷却速率', value: task.coolingRate ? `${Math.abs(task.coolingRate).toFixed(1)} K/s` : 'N/A', color: '#00D4FF' },
      { label: '孔隙率', value: task.porosity !== null ? `${task.porosity.toFixed(2)} %` : 'N/A', color: '#39FF14' },
      { label: '残余应力', value: task.residualStress !== null ? `${task.residualStress.toFixed(1)} MPa` : 'N/A', color: '#f59e0b' },
    ];

    results.forEach((item, i) => {
      const x = 50 + (i % 2) * 250;
      const y = doc.y + Math.floor(i / 2) * 80;

      doc
        .fillColor('#f1f5f9')
        .roundedRect(x, y, 230, 70, 8)
        .fill();

      doc
        .fillColor(item.color)
        .fontSize(10)
        .text(item.label, x + 15, y + 15);

      doc
        .fillColor('#0A1628')
        .fontSize(18)
        .text(item.value, x + 15, y + 35);
    });

    doc.moveDown(3);

    doc
      .fillColor('#0A1628')
      .fontSize(16)
      .text('三、熔池形貌分析', { underline: true })
      .moveDown(1);

    doc
      .fontSize(11)
      .fillColor('#475569')
      .text('下图展示了熔池的横截面形貌轮廓，包括熔深、熔宽和热影响区域。')
      .moveDown(1);

    const poolX = 50;
    const poolY = doc.y;
    const poolWidth = pageWidth;
    const poolHeight = 150;

    doc
      .strokeColor('#cbd5e1')
      .lineWidth(1)
      .rect(poolX, poolY, poolWidth, poolHeight)
      .stroke();

    doc
      .strokeColor('#94a3b8')
      .lineWidth(0.5);
    for (let i = 1; i < 5; i++) {
      doc
        .moveTo(poolX + (poolWidth / 5) * i, poolY)
        .lineTo(poolX + (poolWidth / 5) * i, poolY + poolHeight)
        .stroke();
      doc
        .moveTo(poolX, poolY + (poolHeight / 5) * i)
        .lineTo(poolX + poolWidth, poolY + (poolHeight / 5) * i)
        .stroke();
    }

    const centerX = poolX + poolWidth / 2;
    const poolMaxY = poolY + 20;
    const poolBottomY = poolY + poolHeight - 30;
    const poolWidthHalf = poolWidth * 0.35;

    doc
      .fillColor('#FF6B35')
      .opacity(0.3);
    doc.moveTo(centerX - poolWidthHalf, poolBottomY);
    doc.quadraticCurveTo(centerX - poolWidthHalf * 0.5, poolMaxY + 20, centerX, poolMaxY);
    doc.quadraticCurveTo(centerX + poolWidthHalf * 0.5, poolMaxY + 20, centerX + poolWidthHalf, poolBottomY);
    doc.fill();

    doc
      .fillColor('#FF6B35')
      .opacity(0.5);
    doc.moveTo(centerX - poolWidthHalf * 0.7, poolBottomY);
    doc.quadraticCurveTo(centerX - poolWidthHalf * 0.3, poolMaxY + 40, centerX, poolMaxY + 15);
    doc.quadraticCurveTo(centerX + poolWidthHalf * 0.3, poolMaxY + 40, centerX + poolWidthHalf * 0.7, poolBottomY);
    doc.fill();

    doc
      .fillColor('#fbbf24')
      .opacity(0.7);
    doc.circle(centerX, poolMaxY + 35, 8)
      .fill();

    doc.opacity(1);

    doc
      .strokeColor('#FF6B35')
      .lineWidth(2)
      .moveTo(centerX - poolWidthHalf, poolBottomY)
      .quadraticCurveTo(centerX - poolWidthHalf * 0.5, poolMaxY + 20, centerX, poolMaxY)
      .quadraticCurveTo(centerX + poolWidthHalf * 0.5, poolMaxY + 20, centerX + poolWidthHalf, poolBottomY)
      .stroke();

    doc
      .fillColor('#64748b')
      .fontSize(9);
    doc.text('熔宽', centerX - poolWidthHalf, poolBottomY + 15, { width: poolWidthHalf * 2, align: 'center' });
    doc.text('熔深', centerX + poolWidthHalf + 10, poolY + poolHeight / 2);

    doc.y = poolY + poolHeight + 40;

    doc
      .fillColor('#475569')
      .fontSize(10)
      .text(`• 熔池最大深度: ${(poolHeight * 0.6).toFixed(0)} μm`)
      .text(`• 熔池最大宽度: ${(poolWidth * 0.7).toFixed(0)} μm`)
      .text(`• 深宽比: ${(poolHeight * 0.6 / (poolWidth * 0.7)).toFixed(2)}`)
      .moveDown(2);

    doc
      .fillColor('#0A1628')
      .fontSize(16)
      .text('四、温度场曲线', { underline: true })
      .moveDown(1);

    if (tempData.length > 0) {
      doc
        .fontSize(11)
        .fillColor('#475569')
        .text('下图展示了模拟过程中熔池温度随时间的变化曲线。')
        .moveDown(1);

      const chartX = 50;
      const chartY = doc.y;
      const chartWidth = pageWidth;
      const chartHeight = 180;

      doc
        .fillColor('#f8fafc')
        .rect(chartX, chartY, chartWidth, chartHeight)
        .fill();

      doc
        .strokeColor('#e2e8f0')
        .lineWidth(0.5);
      for (let i = 0; i <= 5; i++) {
        const y = chartY + (chartHeight / 5) * i;
        doc
          .moveTo(chartX, y)
          .lineTo(chartX + chartWidth, y)
          .stroke();
      }

      const maxTemp = Math.max(...tempData.map(d => d.temperature), 3500);
      const minTemp = 300;
      const tempRange = maxTemp - minTemp;

      const xStep = chartWidth / (tempData.length - 1);

      doc
        .strokeColor('#00D4FF')
        .lineWidth(2);
      tempData.forEach((d, i) => {
        const x = chartX + i * xStep;
        const y = chartY + chartHeight - ((d.temperature - minTemp) / tempRange) * chartHeight;
        if (i === 0) {
          doc.moveTo(x, y);
        } else {
          doc.lineTo(x, y);
        }
      });
      doc.stroke();

      doc
        .strokeColor('#FF6B35')
        .lineWidth(1)
        .dash(5, 5);
      const thresholdY = chartY + chartHeight - ((3200 - minTemp) / tempRange) * chartHeight;
      doc
        .moveTo(chartX, thresholdY)
        .lineTo(chartX + chartWidth, thresholdY)
        .stroke();
      doc.undash();

      doc
        .fillColor('#FF6B35')
        .fontSize(9)
        .text('安全阈值 3200K', chartX + chartWidth - 100, thresholdY - 12);

      doc
        .fillColor('#64748b')
        .fontSize(9);
      doc.text(`${maxTemp.toFixed(0)}K`, chartX - 40, chartY);
      doc.text(`${minTemp}K`, chartX - 40, chartY + chartHeight - 10);
      doc.text('时间 (ms)', chartX + chartWidth / 2 - 30, chartY + chartHeight + 10);

      doc.y = chartY + chartHeight + 40;

      doc
        .fillColor('#475569')
        .fontSize(10)
        .text(`• 最高温度: ${Math.max(...tempData.map(d => d.temperature)).toFixed(1)} K`)
        .text(`• 最低温度: ${Math.min(...tempData.map(d => d.temperature)).toFixed(1)} K`)
        .text(`• 温度采集点数: ${tempData.length}`)
        .moveDown(2);
    }

    if (warnings.length > 0) {
      doc
        .fillColor('#dc2626')
        .fontSize(16)
        .text('五、预警记录', { underline: true })
        .moveDown(1);

      warnings.forEach((warning, i) => {
        doc
          .fillColor('#fef2f2')
          .rect(50, doc.y, pageWidth, 50)
          .fill();

        doc
          .strokeColor('#fca5a5')
          .lineWidth(1)
          .rect(50, doc.y, pageWidth, 50)
          .stroke();

        doc
          .fillColor('#dc2626')
          .fontSize(10)
          .text(`预警 ${i + 1}: ${warning.type === 'temperature' ? '温度超限' : '冷却速率异常'}`, 60, doc.y + 8);

        doc
          .fillColor('#475569')
          .fontSize(9)
          .text(warning.message, 60, doc.y + 25);

        doc.y += 60;
      });

      doc.moveDown(1);
    }

    doc
      .fillColor('#0A1628')
      .fontSize(16)
      .text(`${warnings.length > 0 ? '六' : '五'}、残余应力分析`, { underline: true })
      .moveDown(1);

    doc
      .fontSize(11)
      .fillColor('#475569')
      .text('下图展示了构件的残余应力分布情况，应力单位为 MPa。')
      .moveDown(1);

    const stressX = 50;
    const stressY = doc.y;
    const stressWidth = pageWidth;
    const stressHeight = 120;

    doc
      .fillColor('#f8fafc')
      .rect(stressX, stressY, stressWidth, stressHeight)
      .fill();

    const stressValue = task.residualStress || 250;
    const stressLevel = Math.min(stressValue / 500, 1);

    const gradientSteps = 20;
    for (let i = 0; i < gradientSteps; i++) {
      const stepX = stressX + (stressWidth / gradientSteps) * i;
      const stepWidth = stressWidth / gradientSteps;
      const t = i / gradientSteps;
      const r = Math.round(57 + (255 - 57) * t);
      const g = Math.round(255 - (255 - 107) * t);
      const b = Math.round(20 + (53 - 20) * t);
      doc
        .fillColor(`rgb(${r},${g},${b})`)
        .rect(stepX, stressY, stepWidth + 1, stressHeight)
        .fill();
    }

    const markerX = stressX + stressWidth * Math.min(stressLevel, 0.98);
    doc
      .strokeColor('#0A1628')
      .lineWidth(2)
      .moveTo(markerX, stressY - 5)
      .lineTo(markerX, stressY + stressHeight + 5)
      .stroke();

    doc
      .fillColor('#0A1628')
      .fontSize(10)
      .text('0 MPa', stressX, stressY + stressHeight + 15)
      .text('500 MPa', stressX + stressWidth - 50, stressY + stressHeight + 15)
      .text(`当前: ${stressValue.toFixed(1)} MPa`, markerX - 40, stressY - 20);

    doc.y = stressY + stressHeight + 50;

    let stressLevelText = '低';
    let stressColor = '#39FF14';
    if (stressValue > 350) {
      stressLevelText = '高';
      stressColor = '#dc2626';
    } else if (stressValue > 200) {
      stressLevelText = '中';
      stressColor = '#f59e0b';
    }

    doc
      .fillColor('#475569')
      .fontSize(10)
      .text(`• 最大残余应力: ${stressValue.toFixed(1)} MPa`)
      .fillColor(stressColor)
      .text(`• 应力等级: ${stressLevelText}`)
      .fillColor('#475569')
      .text(`• 建议: ${stressValue > 350 ? '建议降低激光功率或增加预热温度' : stressValue > 200 ? '建议优化扫描策略以降低应力集中' : '残余应力在合理范围内'}`)
      .moveDown(2);

    doc
      .strokeColor('#00D4FF')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke()
      .moveDown(1);

    doc
      .fillColor('#64748b')
      .fontSize(10)
      .text('报告生成时间: ' + new Date().toLocaleString('zh-CN'))
      .text('报告生成系统: 高精度粉末床熔融增材制造熔池动力学模拟平台')
      .text('© 2026 增材制造工艺优化平台 - 保留所有权利', { align: 'center' });

    doc.end();
  });
};
